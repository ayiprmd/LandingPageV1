import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#100e16]">
      <Card className="w-full max-w-md mx-4 border-[#302938] bg-[#17131f] text-[#eeeae4]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-[#b76cf4]" />
            <h1 className="text-2xl font-bold">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-sm text-[#8c8591]">
            The requested page does not exist.
          </p>
          <a
            href="/"
            className="mt-6 inline-block border border-[#a65ee8] px-4 py-2 text-xs uppercase tracking-wider text-[#b76cf4] hover:bg-[#a65ee8] hover:text-[#100e16] transition-colors"
          >
            Back to Home
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
