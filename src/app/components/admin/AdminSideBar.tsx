// Server Component (Default) - Optimized for static content

import Link from 'next/link';

// Use a CSS framework class to handle the toggle/width (e.g., Tailwind classes)
const sidebarBaseClasses = '  inset-y-0 top-16 left-0 w-50 bg-gray-800 text-white p-4 hidden lg:block';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '🏠' },
    { name: 'Hotels', href: '/admin/hotels', icon: '🏨' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Menu Categories', href: '/admin/categories', icon: '📋' },
    { name: 'Feedback', href: '/admin/feedback', icon: '💬' },
];

export default function AdminSidebar() {
  // We don't need usePathname here because we are loading the active state via CSS
  // or a custom logic passed down from the URL structure (optional complexity).
  
  return (
    <aside className={sidebarBaseClasses}>
      <div className="text-xl font-bold mb-8">Admin Panel</div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition duration-150"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Optional: Add a small Client Component here for a dark/light mode toggle or sidebar collapse button */}
    </aside>
  );
}