import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router';
import { login } from '../utils/api';
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';


// Zod validation schema for login
const loginSchema = z.object({
    username: z.string().min(4, "Username must be at least 4 characters"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await login(data);

            // Assuming the login response includes a token and user info
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            toast({
                description: "Welcome back!",
            })

            // Redirect to home or dashboard
            navigate('/');
        } catch (error: any) {
            // Handle login errors
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.response?.data?.message || "Invalid credentials",
            })
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login to Snippet Manager</CardTitle>
                    <CardDescription>
                        Enter your username and password to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Input
                                type="input"
                                placeholder="Username"
                                {...register('username')}
                                disabled={isSubmitting}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="password"
                                placeholder="Password"
                                {...register('password')}
                                disabled={isSubmitting}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Don't have an account?
                                <Link to="/register">
                                    <Button
                                        variant="link"
                                    >
                                        Register
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

export default Login;