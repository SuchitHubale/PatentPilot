import { assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'
import PatentCard from './PatentCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs"

const Message = ({ role, content, patents }) => {
    // Function to format message content
    const formatMessage = (text) => {
        if (!text) return null;

        // Convert string to formatted JSX with basic markdown-like formatting
        const formatText = (str) => {
            // Handle headers (## Header)
            str = str.replace(/^## (.*?)$/gm, '<h3 class="text-xl font-bold text-white mt-6 mb-3 flex items-center gap-2">$1</h3>');

            // Handle subheaders (### Subheader)
            str = str.replace(/^### (.*?)$/gm, '<h4 class="text-lg font-semibold text-gray-200 mt-4 mb-2">$1</h4>');

            // Handle code blocks (``[code](cci:7://file:///d:/PatentPilot/.vscode:0:0-0:0)``)
            str = str.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 p-3 rounded-lg my-3 overflow-x-auto border border-gray-700"><code class="text-sm">$1</code></pre>');

            // Handle inline code ([code](cci:7://file:///d:/PatentPilot/.vscode:0:0-0:0))
            str = str.replace(/`([^`]+)`/g, '<code class="bg-gray-700/50 px-2 py-0.5 rounded text-sm text-blue-300">$1</code>');

            // Handle bold (**text**)
            str = str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');

            // Handle italic (*text*)
            str = str.replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>');

            // Handle bullet points (- item)
            str = str.replace(/^- (.*?)$/gm, '<li class="ml-4 mb-2 text-gray-300">$1</li>');

            // Wrap consecutive <li> elements in <ul>
            str = str.replace(/(<li.*?<\/li>\s*)+/g, '<ul class="list-disc list-inside space-y-1 my-3">$&</ul>');

            // Handle numbered lists (1. item)
            str = str.replace(/^\d+\.\s+(.*?)$/gm, '<li class="ml-4 mb-2 text-gray-300">$1</li>');

            // Handle line breaks (preserve double line breaks as paragraphs)
            str = str.replace(/\n\n/g, '</p><p class="mb-3 text-gray-300 leading-relaxed">');
            str = str.replace(/\n/g, '<br />');

            // Wrap in paragraph if not already wrapped
            if (!str.startsWith('<')) {
                str = '<p class="mb-3 text-gray-300 leading-relaxed">' + str + '</p>';
            }

            return str;
        };

        return (
            <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formatText(text) }}
            />
        );
    };

    return (
        <div className='flex flex-col items-center w-full max-w-3xl text-sm'>
            <div className={`flex flex-col w-full mb-8 ${role === 'user' && "items-end"}`}>
                <div className={`group relative flex max-w-2xl py-3 rounded-xl ${role === 'user' ? "bg-[#414158] px-5" : "gap-3 w-full"}`}>
                    {/* Hover actions */}
                    <div className={`opacity-0 group-hover:opacity-100 absolute ${role === 'user' ? "-left-16 top-2.5" : "left-9 -bottom-6"} transition-all duration-200 z-10`}>
                        <div className='flex items-center gap-2 px-2 py-1 bg-gray-800 rounded-lg shadow-lg opacity-70'>
                            {
                                role === 'user' ? (
                                    <>
                                        <Image className='w-4 transition-opacity cursor-pointer hover:opacity-100' src={assets.copy_icon} alt='Copy' />
                                        <Image className='w-4.5 cursor-pointer hover:opacity-100 transition-opacity' src={assets.pencil_icon} alt='Edit' />
                                    </>
                                ) : (
                                    <>
                                        <Image className='w-4.5 cursor-pointer hover:opacity-100 transition-opacity' src={assets.copy_icon} alt='Copy' />
                                        <Image className='w-4 transition-opacity cursor-pointer hover:opacity-100' src={assets.regenerate_icon} alt='Regenerate' />
                                        <Image className='w-4 transition-opacity cursor-pointer hover:opacity-100' src={assets.like_icon} alt='Like' />
                                        <Image className='w-4 transition-opacity cursor-pointer hover:opacity-100' src={assets.dislike_icon} alt='Dislike' />
                                    </>
                                )
                            }
                        </div>
                    </div>

                    {/* Message content */}
                    {
                        role === 'user' ?
                            (
                                <div className='text-white/90'>
                                    {formatMessage(content)}
                                </div>
                            ) : (
                                <>
                                    <Image className='flex-shrink-0 p-1 border rounded-full h-9 w-9 border-white/15' src={assets.logo_icon} alt='AI' />
                                    <div className='w-full space-y-4'>

                                        <Tabs defaultValue="ai-responce" className="space-y-6">
                                            <TabsList className="sticky top-0 z-10 grid w-full grid-cols-2 bg-gray-800 border-b border-gray-700">
                                                <TabsTrigger
                                                    value="ai-responce"
                                                    className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
                                                >
                                                    AI Suggestion
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="similar-patents"
                                                    className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
                                                >
                                                    Similar Patents
                                                </TabsTrigger>
                                            </TabsList>

                                            {/* Users Tab */}
                                            <TabsContent value="ai-responce" className="duration-300 animate-in fade-in-50">
                                                {formatMessage(content)}
                                            </TabsContent>

                                            {/* Stores Tab */}
                                            <TabsContent value="similar-patents">
                                                {patents && patents.length > 0 && (
                                                    <div className="mb-4">
                                                        <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold text-white">
                                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Similar Patents Found ({patents.length})
                                                        </h3>
                                                        <div className="space-y-3">
                                                            {patents.map((patent, index) => (
                                                                <PatentCard key={index} patent={patent} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                            </TabsContent>

                                        </Tabs>
                                    </div>
                                </>
                            )
                    }
                </div>
            </div>

            <style jsx>{`
                .prose {
                    max-width: 100%;
                }
                
                .prose code {
                    color: #93c5fd;
                    font-family: 'Courier New', monospace;
                }
                
                .prose pre {
                    background-color: #1f2937;
                    color: #e5e7eb;
                }
                
                .prose pre code {
                    background-color: transparent;
                    padding: 0;
                    color: #e5e7eb;
                }
                
                .prose h3 {
                    border-bottom: 2px solid rgba(59, 130, 246, 0.3);
                    padding-bottom: 0.5rem;
                }
                
                .prose ul {
                    margin-left: 1rem;
                }
                
                .prose li {
                    line-height: 1.6;
                }
                
                .prose strong {
                    color: #ffffff;
                    font-weight: 600;
                }
            `}</style>
        </div>
    )
}

export default Message