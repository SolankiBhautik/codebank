import { buttonVariants } from "@/components/ui/button"
import { Link } from "react-router"
import { Plus, List } from "lucide-react"


const Home = () => {
    return (
        <div>
            <div className="p-2 flex flex-col w-fit gap-2">
                <Link to="/snippets/list" className={buttonVariants()}>
                    <List />    Your Snippets
                </Link>
                <Link to="/snippets/create" className={buttonVariants({ variant: "outline" })}>
                    <Plus />    Create New Snippet
                </Link>
            </div>
        </div>
    )
}

export default Home