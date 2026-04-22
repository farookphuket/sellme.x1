import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-red-500 mb-4">Thaitan Tours</h3>
          <p className="text-gray-400 text-sm">บริการทัวร์คุณภาพ ประสบการณ์กว่า 10 ปี</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">เมนู</h4>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li><Link href="/tours">โปรแกรมทัวร์</Link></li>
            <li><Link href="/contact-us">ติดต่อเรา</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">ติดต่อ</h4>
          <p className="text-gray-400 text-sm">โทร: 02-123-4567</p>
        </div>
      </div>
    </footer>
  );
}
