import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { githubLight } from '@uiw/codemirror-theme-github';
import { LanguageSupport } from '@codemirror/language';
import { useTheme } from "@/components/theme-provider";


const languageMap: Record<string, LanguageSupport> = {
    'javascript': javascript(),
    'typescript': javascript({ typescript: true }),
    'python': python(),
    'cpp': cpp(),
    'java': java(),
};

interface CodeEditorProps {
    value: string;
    onChange?: (value: string) => void;
    language?: string;
    editable?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    value,
    onChange = () => { },
    language = 'javascript',
    editable = true,
}) => {

    const languageSupport =
        languageMap[language.toLowerCase()] ||
        languageMap['javascript'];
    const [calculatedHeight, setCalculatedHeight] = useState<string>('300px');
    const { theme } = useTheme();

    const codeMirrorTheme = theme === 'dark' ? oneDark : githubLight;

    useEffect(() => {
        if (value) {
            const lines = value.split('\n').length;
            const lineHeight = 20;
            const padding = 20;
            setCalculatedHeight(`${lines * lineHeight + padding}px`);
        } else {
            setCalculatedHeight('300px');
        }
    }, [value]);


    return (
        <div className="border rounded-md overflow-hidden">
            <CodeMirror
                value={value}
                height={calculatedHeight}
                theme={codeMirrorTheme}
                extensions={[languageSupport]}
                editable={editable}
                onChange={(val) => editable && onChange(val)}
            />
        </div>
    );
};