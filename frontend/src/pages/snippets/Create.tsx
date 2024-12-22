import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { CodeEditor } from '../../components/CodeEditor';
import { CategoryTagSelector } from '../../components/CategoryTagSelector';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
// import { toast } from 'sonner';
import { createSnippet, getSnippet, updateSnippet } from '../../utils/api'
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router';
import { useToast } from "@/hooks/use-toast"


// Predefined lists for selectors
const LANGUAGES = [
    // Programming Languages
    'C', 'C++', 'Python', 'JavaScript', 'TypeScript',
    'Java', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',

    // Frameworks & Libraries
    'React', 'Vue', 'Angular', 'Svelte',
    'Node.js', 'Express', 'Django', 'Flask',
    'Spring', 'Laravel', 'Ruby on Rails',

    // Frontend Frameworks
    'Next.js', 'Nuxt.js', 'Gatsby', 'Remix',

    // CMS & Backend
    'Strapi', 'Contentful', 'WordPress', 'Typo3',
    'Sanity', 'Prismic',

    // Mobile
    'React Native', 'Flutter', 'Xamarin', 'Ionic'
];

const SNIPPET_TYPES = [
    'Function',
    'Class',
    'Boilerplate',
    'Full Template',
    'Component',
    'Hook',
    'Utility',
    'Configuration',
    'Algorithm'
];

// Zod Validation Schema
const snippetSchema = z.object({
    heading: z.string().min(3, "Heading must be at least 3 characters"),
    description: z.string()
        .max(500, "Description cannot exceed 500 characters"),
    code: z.string().min(1, "Code snippet is required"),
    tags: z.array(z.string()).optional(),
    language: z.string().optional(),
    type: z.string().optional()
});

const Create = () => {
    const [selectedLanguage] = useState<string>('javascript');
    const [isEditing, setIsEditing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();

    // Check authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<z.infer<typeof snippetSchema>>({
        resolver: zodResolver(snippetSchema),
        defaultValues: {
            heading: '',
            description: '',
            code: '',
            tags: [],
            language: '',
            type: ''
        }
    });

    useEffect(() => {
        // Check if we're in edit mode
        if (id) {
            setIsEditing(true);
            // Fetch snippet details for editing
            const fetchSnippet = async () => {
                try {
                    const response = await getSnippet(id);
                    const snippet = response.data;

                    // Set form values with fetched snippet data
                    setValue('heading', snippet.heading);
                    setValue('description', snippet.description);
                    setValue('code', snippet.code);
                    setValue('tags', snippet.tags || []);
                    setValue('language', snippet.language);
                    setValue('type', snippet.type);
                } catch (error) {
                    toast({
                        variant: "destructive",
                        description: "Error Fetching Snippet",
                    })
                    navigate('/');
                }
            };

            fetchSnippet();
        }
    }, [id, navigate, setValue]);



    const onSubmit = async (data: z.infer<typeof snippetSchema>) => {
        try {
            if (isEditing) {
                const res = await updateSnippet(id, data);
                if (!res) {
                    console.log(`error while updating the snippet `, res)
                    toast({
                        variant: "destructive",
                        description: "error while updating the snippet",
                    })
                    return
                }
                toast({
                    description: "Your snippet has been successfully updated.",
                })

                reset();
            } else {
                await createSnippet(data);
                toast({
                    description: "Your snippet has been successfully saved.",
                })
                reset();
            }


            navigate('/');

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast({
                    variant: "destructive",
                    description: error.response?.data?.message || "Failed to create snippet",
                })
            } else {
                toast({
                    variant: "destructive",
                    description: "An unexpected error occurred",
                })
            }
        }
    };

    return (
        <>
            <Card className="max-w-4xl mx-auto p-4 border-y-0 rounded-none">
                <CardHeader>
                    <CardTitle>
                        {isEditing ? "Edit Code Snippet" : "Create New Code Snippet"}
                    </CardTitle>
                    <CardDescription>
                        {isEditing
                            ? "Update the details of your existing code snippet."
                            : "Share your code snippet with the community. Provide a clear heading, description, and select appropriate metadata."}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* SEO Optimized Heading Input */}
                        <div>
                            <Input
                                {...register('heading')}
                                placeholder="Snippet Heading (e.g., React useCustomHook)"
                                className="w-full"
                            />
                            {errors.heading && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.heading.message}
                                </p>
                            )}
                        </div>

                        {/* Description with Character Count */}
                        <div>
                            <Textarea
                                {...register('description')}
                                placeholder="Describe your snippet's purpose and usage..."
                                className="w-full"
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Code Editor with Syntax Highlighting */}
                        <Controller
                            name="code"
                            control={control}
                            render={({ field }) => (
                                <CodeEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    language={selectedLanguage}
                                />
                            )}
                        />
                        {errors.code && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.code.message}
                            </p>
                        )}

                        {/* Metadata Selectors */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Language Selector */}
                            <Controller
                                name="language"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LANGUAGES.map(lang => (
                                                <SelectItem key={lang} value={lang}>
                                                    {lang}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {/* Type Selector */}
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Snippet Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SNIPPET_TYPES.map(type => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {/* Tags Input */}
                            <Controller
                                name="tags"
                                control={control}
                                render={({ field }) => (
                                    <CategoryTagSelector
                                        value={field.value || []}
                                        onChange={field.onChange}
                                        placeholder="Add Tags"
                                    />
                                )}
                            />
                        </div>


                        <Button type="submit" className="w-full">
                            {isEditing ? "Update Snippet" : "Create Snippet"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {!isAuthenticated && (
                <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center z-50">
                    <div className="bg-card p-8 rounded-lg shadow-lg text-center space-y-4">
                        <h2 className="text-2xl font-bold">Login Required</h2>
                        <p className="text-gray-600">
                            You need to log in to create or edit snippets.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link to="/login">
                                <Button>
                                    Login
                                </Button>
                            </Link>
                            <Link to="/">
                                <Button variant="outline">
                                    Go Back
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>

    );
};


export default Create;