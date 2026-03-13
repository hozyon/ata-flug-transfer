import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-slate-200 font-mono">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-red-500/30 max-w-4xl w-full shadow-2xl">
                        <div className="flex items-center gap-4 mb-6 text-red-400">
                            <i className="fa-solid fa-bug text-3xl"></i>
                            <h1 className="text-2xl font-bold">Admin Panel Çöktü (React Error)</h1>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-white mb-2">Hata Mesajı:</h2>
                            <div className="bg-black/50 p-4 rounded-lg text-red-300 overflow-x-auto whitespace-pre-wrap">
                                {this.state.error?.toString()}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-white mb-2">Component Stack Trace:</h2>
                            <div className="bg-black/50 p-4 rounded-lg text-slate-400 overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed">
                                {this.state.errorInfo?.componentStack}
                            </div>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-8 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
                        >
                            Sayfayı Yenile
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
