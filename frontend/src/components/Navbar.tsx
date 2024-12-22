import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import ModeToggle from '@/components/mode-toggle';
import { useToast } from "@/hooks/use-toast"


const Navbar = () => {
    const { toast } = useToast();


    // Check if user is logged in by checking token in localStorage
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        // Remove token and user info from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Show logout toast
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        })
    };

    return (
        <nav className="flex justify-between items-center p-4 border-b">
            <Link to="/" className="text-xl font-bold">Code Bank</Link>
            <div className="flex items-center space-x-4">
                <Link to="/">
                    <Button variant="outline">List</Button>
                </Link>
                <Link to="/create">
                    <Button>Create</Button>
                </Link>
                {!isLoggedIn ? (
                    <Link to="/login">
                        <Button>Login</Button>
                    </Link>
                ) : (
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                )}
                <ModeToggle />
            </div>
        </nav>
    );
};

export default Navbar;