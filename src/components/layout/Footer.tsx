export function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-400">
      <a href="/privacy" className="hover:text-gray-200 transition-colors">
        Privacy Policy
      </a>
      <span>•</span>
      <a href="/terms" className="hover:text-gray-200 transition-colors">
        Terms of Service
      </a>
      <span>•</span>
      <a href="/help" className="hover:text-gray-200 transition-colors">
        Help Center
      </a>
    </footer>
  );
}
