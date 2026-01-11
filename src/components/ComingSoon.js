import { Construction } from 'lucide-react';

const ComingSoon = ({ title = "Coming Soon", message = "We are working hard to bring you this feature." }) => {
    return (
        <div className="min-h-screen bg-background text-white">
            <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
                <div className="bg-secondary p-6 rounded-full mb-6 animate-pulse">
                    <Construction size={64} className="text-blue-500" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {title}
                </h1>
                <p className="text-gray-400 text-lg max-w-md">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default ComingSoon;
