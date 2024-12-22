import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast"
import { useNavigate, Link } from 'react-router';
import { register } from '@/utils/api';

const Register = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({ username: '', password: '', confirmPassword: '' });

        const formData = new FormData(e.target as HTMLFormElement);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        // Validation
        let hasErrors = false;
        const newErrors = { username: '', password: '', confirmPassword: '' };

        if (username.length < 4) {
            newErrors.username = 'Username must be at least 4 characters';
            hasErrors = true;
        }

        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            hasErrors = true;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await register({ username, password });

            toast({
                description: "Registration successful!",
            });
            navigate('/login');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.response?.data?.message || "Registration failed. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>
                        Enter your details to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                type="text"
                                name="username"
                                placeholder="Username"
                                disabled={isSubmitting}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Password"
                                disabled={isSubmitting}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                disabled={isSubmitting}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Already have an account?
                                <Link to="/login">
                                    <Button
                                        variant="link"
                                    >
                                        Login
                                    </Button>
                                </Link>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;