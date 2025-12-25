/**
 * Auth Divider Component
 * "Or continue with" divider used in auth forms
 */
export default function AuthDivider() {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-gray-400">Or continue with</span>
            </div>
        </div>
    );
}
