import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { getSnippets } from '../../utils/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Copy, Search, Edit } from 'lucide-react';
import { CodeEditor } from '../../components/CodeEditor';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast"
import { Link } from 'react-router';


interface Snippet {
    id: string;
    heading: string;
    description: string;
    code: string;
    language: string;
    tags: string[];
}

function List() {
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const copyButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const { toast } = useToast();

    const fetchSnippets = async (query: string = '') => {
        setIsLoading(true);
        try {
            const response = await getSnippets(query);
            const data = response.data.map((hit: any) => ({
                ...hit._source,
                id: hit._id
            }));
            setSnippets(data);
        } catch (error) {
            console.error('Error fetching snippets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSnippets();
    }, []);

    useEffect(() => {

        fetchSnippets(searchQuery)
    }, [searchQuery]);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            toast({
                description: "Code copied to clipboard.",
            })
        });
    };


    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && snippets.length > 0) {
            e.preventDefault();
            if (copyButtonRefs.current[0]) {
                copyButtonRefs.current[0].focus();
            }
        }
    };

    useEffect(() => {
        const handleGlobalKeyDown = (e: any) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('snippet-search-input');
                searchInput?.focus();
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, []);

    return (
        <div className="container mx-auto p-4 mt-8">
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id="snippet-search-input"
                    placeholder="Search snippets (Ctrl + K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 bg-muted px-2 py-1 rounded text-xs">
                    Ctrl + K
                </kbd>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {snippets.map((snippet, index) => (
                        <Card key={snippet.id} className="mb-4 transition-all duration-200 ease-in-out h-fit relative">
                            <CardHeader className="flex flex-row items-center justify-between p-2">
                                <CardTitle className="text-sm font-medium">
                                    {snippet.heading}
                                </CardTitle>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                ref={el => copyButtonRefs.current[index] = el}
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => copyToClipboard(snippet.code)}
                                                tabIndex={0}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Copy Snippet</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </CardHeader>
                            <CardContent className="p-0 relative">
                                <CodeEditor
                                    value={snippet.code}
                                    editable={false}
                                />
                                <div className="absolute bottom-5 right-2" tabIndex={-1}>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <Link to={`/edit/${snippet.id}`} tabIndex={-1}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className=""
                                                    tabIndex={-1}
                                                >
                                                    <Edit className="h-4 w-4 text-primary" />
                                                </Button>
                                            </Link>
                                            <TooltipContent>Edit Snippet</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default List;
