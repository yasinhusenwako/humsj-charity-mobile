import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2, Phone } from "lucide-react";
import { RecaptchaVerifier } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup, login, loginWithGoogle, loginWithPhone } = useAuth();
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [phoneData, setPhoneData] = useState({
    phoneNumber: "",
    verificationCode: "",
  });
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const validatePassword = (password) => {
    const errors = [];
    let strength = 0;

    // Length validation
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    } else {
      strength += 1;
    }

    // Uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    } else {
      strength += 1;
    }

    // Lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    } else {
      strength += 1;
    }

    // Number
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    } else {
      strength += 1;
    }

    // Special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    } else {
      strength += 1;
    }

    return { errors, strength };
  };

  useEffect(() => {
    // Initialize reCAPTCHA only when needed
    return () => {
      // Cleanup
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();

      toast({
        title: "Success!",
        description: "You have successfully signed in with Google.",
      });

      const user = auth.currentUser;
      if (user?.email === "admin@humsj.edu.et") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: "Sign In Failed",
        description: error.message || "Failed to sign in with Google.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const phoneNumber = phoneData.phoneNumber.startsWith("+")
        ? phoneData.phoneNumber
        : `+251${phoneData.phoneNumber}`;

      // Initialize reCAPTCHA if not already done
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              // reCAPTCHA solved
            },
          }
        );
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await loginWithPhone(phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setShowPhoneVerification(true);

      toast({
        title: "Code Sent",
        description: "Verification code has been sent to your phone.",
      });
    } catch (error) {
      console.error("Phone sign in error:", error);
      toast({
        title: "Failed to Send Code",
        description:
          error.message || "Please check your phone number and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await confirmationResult.confirm(phoneData.verificationCode);

      toast({
        title: "Success!",
        description: "You have successfully signed in.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(signInData.email, signInData.password);

      // Get user role from Firestore
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const isAdmin = userData.role === "admin";

          toast({
            title: "Success!",
            description: `Welcome ${isAdmin ? "Admin" : "back"}!`,
          });

          // Redirect based on role from Firestore
          navigate(isAdmin ? "/admin" : "/dashboard");
        } else {
          // Fallback to email check if Firestore profile doesn't exist
          toast({
            title: "Success!",
            description: "You have successfully signed in.",
          });

          const isAdmin = signInData.email === "admin@humsj.edu.et";
          navigate(isAdmin ? "/admin" : "/dashboard");
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign In Failed",
        description:
          error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    const validation = validatePassword(signUpData.password);
    if (validation.errors.length > 0) {
      toast({
        title: "Password Requirements Not Met",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive",
      });
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signup(signUpData.email, signUpData.password, signUpData.fullName);

      // Get user role from Firestore after signup
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const isAdmin = userData.role === "admin";

          toast({
            title: "Success!",
            description: `Account created! Welcome ${isAdmin ? "Admin" : ""}!`,
          });

          // Redirect based on role from Firestore
          navigate(isAdmin ? "/admin" : "/dashboard");
        } else {
          // Fallback
          toast({
            title: "Success!",
            description: "Your account has been created successfully.",
          });

          const isAdmin = signUpData.email === "admin@humsj.edu.et";
          navigate(isAdmin ? "/admin" : "/dashboard");
        }
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign Up Failed",
        description:
          error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-2xl">H</span>
          </div>
          <span className="font-bold text-2xl text-primary-foreground">
            HUMSJ Charity
          </span>
        </Link>

        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signin">Email</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="phone" id="phone-tab">
                  Phone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      required
                      value={signInData.email}
                      onChange={(e) =>
                        setSignInData({ ...signInData, email: e.target.value })
                      }
                      placeholder="your.email@example.com"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="signin-password"
                        type={showSignInPassword ? "text" : "password"}
                        required
                        value={signInData.password}
                        onChange={(e) =>
                          setSignInData({
                            ...signInData,
                            password: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignInPassword(!showSignInPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showSignInPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <p className="text-sm text-center text-muted-foreground">
                    <a href="#" className="text-primary hover:underline">
                      Forgot password?
                    </a>
                  </p>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const phoneTab = document.getElementById("phone-tab");
                        if (phoneTab) phoneTab.click();
                      }}
                      disabled={isLoading}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Phone
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      required
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Your full name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      required
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, email: e.target.value })
                      }
                      placeholder="your.email@example.com"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="signup-password"
                        type={showSignUpPassword ? "text" : "password"}
                        required
                        value={signUpData.password}
                        onChange={(e) => {
                          const newPassword = e.target.value;
                          setSignUpData({
                            ...signUpData,
                            password: newPassword,
                          });
                          const validation = validatePassword(newPassword);
                          setPasswordErrors(validation.errors);
                          setPasswordStrength(validation.strength);
                        }}
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignUpPassword(!showSignUpPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showSignUpPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {signUpData.password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            Password Strength
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {passwordStrength === 0 && "Very Weak"}
                            {passwordStrength === 1 && "Weak"}
                            {passwordStrength === 2 && "Fair"}
                            {passwordStrength === 3 && "Good"}
                            {passwordStrength === 4 && "Strong"}
                            {passwordStrength === 5 && "Very Strong"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              passwordStrength <= 2
                                ? "bg-red-500"
                                : passwordStrength === 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            } ${
                              passwordStrength === 0
                                ? "w-0"
                                : passwordStrength === 1
                                ? "w-1/5"
                                : passwordStrength === 2
                                ? "w-2/5"
                                : passwordStrength === 3
                                ? "w-3/5"
                                : passwordStrength === 4
                                ? "w-4/5"
                                : "w-full"
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Password Validation Errors */}
                    {passwordErrors.length > 0 && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm font-medium text-red-800 mb-1">
                          Password Requirements:
                        </p>
                        <ul className="text-xs text-red-700 space-y-1">
                          {passwordErrors.map((error, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                              {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="signup-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={signUpData.confirmPassword}
                        onChange={(e) =>
                          setSignUpData({
                            ...signUpData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <p className="text-sm text-center text-muted-foreground">
                    By signing up, you agree to our Terms of Service
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                {!showPhoneVerification ? (
                  <form onSubmit={handlePhoneSignIn} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <div className="flex gap-2 mt-2">
                        <Input value="+251" disabled className="w-20" />
                        <Input
                          id="phone-number"
                          type="tel"
                          required
                          value={phoneData.phoneNumber}
                          onChange={(e) =>
                            setPhoneData({
                              ...phoneData,
                              phoneNumber: e.target.value,
                            })
                          }
                          placeholder="9XXXXXXXX"
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter your Ethiopian phone number without the country
                        code
                      </p>
                    </div>

                    <div id="recaptcha-container"></div>

                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Code...
                        </>
                      ) : (
                        <>
                          <Phone className="mr-2 h-4 w-4" />
                          Send Verification Code
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">
                      We'll send you a verification code via SMS
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCode} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="verification-code">
                        Verification Code
                      </Label>
                      <Input
                        id="verification-code"
                        type="text"
                        required
                        value={phoneData.verificationCode}
                        onChange={(e) =>
                          setPhoneData({
                            ...phoneData,
                            verificationCode: e.target.value,
                          })
                        }
                        placeholder="Enter 6-digit code"
                        className="mt-2"
                        maxLength={6}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter the code sent to +251{phoneData.phoneNumber}
                      </p>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Sign In"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowPhoneVerification(false);
                        setPhoneData({ phoneNumber: "", verificationCode: "" });
                      }}
                    >
                      Use Different Number
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-primary hover:underline">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
