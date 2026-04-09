import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Chrome, ArrowLeft } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import SEOHead from "@/components/SEOHead";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z
    .string()
    .min(6, "Password must be at least 6 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");
const AUTH0_RETURN_TO =
    import.meta.env.VITE_AUTH0_REDIRECT_URI || "https://somthing.app";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        name?: string;
    }>({});

    const { user, signIn, signUp, signInWithGoogle } = useAuth();
    const {
        isLoading: isAuth0Loading,
        isAuthenticated: isAuth0Authenticated,
        error: auth0Error,
        user: auth0User,
        loginWithRedirect,
        logout: auth0Logout,
    } = useAuth0();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const from = (location.state as any)?.from?.pathname || "/";

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    const validateForm = () => {
        const newErrors: { email?: string; password?: string; name?: string } =
            {};

        try {
            emailSchema.parse(email);
        } catch (e) {
            if (e instanceof z.ZodError) {
                newErrors.email = e.errors[0].message;
            }
        }

        try {
            passwordSchema.parse(password);
        } catch (e) {
            if (e instanceof z.ZodError) {
                newErrors.password = e.errors[0].message;
            }
        }

        if (!isLogin && fullName) {
            try {
                nameSchema.parse(fullName);
            } catch (e) {
                if (e instanceof z.ZodError) {
                    newErrors.name = e.errors[0].message;
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) {
                    if (error.message.includes("Invalid login credentials")) {
                        toast({
                            title: "Login Failed",
                            description:
                                "Invalid email or password. Please try again.",
                            variant: "destructive",
                        });
                    } else {
                        toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive",
                        });
                    }
                } else {
                    toast({
                        title: "Welcome back!",
                        description: "You have successfully logged in.",
                    });
                }
            } else {
                const { error } = await signUp(email, password, fullName);
                if (error) {
                    if (error.message.includes("already registered")) {
                        toast({
                            title: "Account Exists",
                            description:
                                "This email is already registered. Please log in instead.",
                            variant: "destructive",
                        });
                    } else {
                        toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive",
                        });
                    }
                } else {
                    toast({
                        title: "Account Created!",
                        description:
                            "Welcome to Somthing! Your account has been created.",
                    });
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const { error } = await signInWithGoogle();
        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleAuth0Login = async () => {
        await loginWithRedirect();
    };

    const handleAuth0Signup = async () => {
        await loginWithRedirect({
            authorizationParams: { screen_hint: "signup" },
        });
    };

    const handleAuth0Logout = () => {
        auth0Logout({ logoutParams: { returnTo: AUTH0_RETURN_TO } });
    };

    return (
        <>
            <SEOHead
                title={isLogin ? "Login | Somthing" : "Sign Up | Somthing"}
                description="Sign in or create an account to access your Somthing account."
            />

            <div className="min-h-screen bg-background flex">
                {/* Left side - Form */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full max-w-md"
                    >
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/")}
                            className="mb-8 -ml-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                {isLogin ? "Welcome back" : "Create account"}
                            </h1>
                            <p className="text-muted-foreground">
                                {isLogin
                                    ? "Enter your credentials to access your account"
                                    : "Join Somthing and start decorating your space"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="fullName">
                                            Full Name
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="fullName"
                                                type="text"
                                                value={fullName}
                                                onChange={(e) =>
                                                    setFullName(e.target.value)
                                                }
                                                placeholder="John Doe"
                                                className="pl-10"
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="text-sm text-destructive">
                                                {errors.name}
                                            </p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="you@example.com"
                                        className="pl-10"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="pl-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? "Loading..."
                                    : isLogin
                                      ? "Sign In"
                                      : "Create Account"}
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-background text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            size="lg"
                            onClick={handleGoogleSignIn}
                        >
                            <Chrome className="w-4 h-4 mr-2" />
                            Google
                        </Button>

                        <div className="mt-6 rounded-lg border border-border p-4">
                            <p className="text-sm font-medium text-foreground">
                                Auth0 Universal Login
                            </p>

                            {isAuth0Loading ? (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Checking Auth0 session...
                                </p>
                            ) : isAuth0Authenticated ? (
                                <>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Logged in as{" "}
                                        {auth0User?.email ||
                                            auth0User?.name ||
                                            "Auth0 user"}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="mt-3 w-full"
                                        onClick={handleAuth0Logout}
                                    >
                                        Logout from Auth0
                                    </Button>
                                </>
                            ) : (
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleAuth0Login}
                                    >
                                        Login with Auth0
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleAuth0Signup}
                                    >
                                        Signup with Auth0
                                    </Button>
                                </div>
                            )}

                            {auth0Error && (
                                <p className="mt-2 text-sm text-destructive">
                                    Error: {auth0Error.message}
                                </p>
                            )}
                        </div>

                        <p className="mt-8 text-center text-muted-foreground">
                            {isLogin
                                ? "Don't have an account?"
                                : "Already have an account?"}{" "}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary hover:underline font-medium"
                            >
                                {isLogin ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </motion.div>
                </div>

                {/* Right side - Decorative */}
                <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-blob" />
                        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-blob-slow" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 text-center"
                    >
                        <h2 className="text-4xl font-bold text-foreground mb-4">
                            Art That Speaks
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-md">
                            Discover unique wall art posters that transform your
                            space into a gallery of inspiration.
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Auth;
