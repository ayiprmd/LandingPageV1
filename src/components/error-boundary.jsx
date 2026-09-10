import { Component } from 'react';

function toError(value) {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === 'string') {
    return new Error(value);
  }
  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error(String(value));
  }
}

function DefaultFallback({ error, resetError }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#100e16] p-6 text-[#eeeae4]">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-xl font-semibold text-red-400">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          An error occurred in this section.
        </p>
        {import.meta.env.DEV ? (
          <pre className="mt-4 overflow-x-auto rounded bg-[#18151f] border border-[#302938] p-3 text-left text-xs text-red-300">
            {error.message || String(error)}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={resetError}
          className="mt-4 rounded bg-[#a65ee8] px-4 py-2 text-sm text-[#100e16] font-semibold hover:bg-[#b76cf4]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error: toError(error) };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', toError(error), info.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error !== null && prevProps.resetKey !== this.props.resetKey) {
      this.resetError();
    }
  }

  resetError = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (error === null) {
      return this.props.children;
    }
    const Fallback = this.props.FallbackComponent ?? DefaultFallback;
    return <Fallback error={error} resetError={this.resetError} />;
  }
}
