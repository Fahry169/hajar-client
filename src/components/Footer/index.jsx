import Image from "next/image";

const Footer = () => {
  const footerData = {
    product: ["Test", "Test", "Test"],
    company: ["Test", "Test", "Test"],
    legal: ["Test", "Test", "Test"],
  };

  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4 gap-2">
               <Image
              alt="Logo"
              src="/logo/logo.png"
              width={45}
              height={50}
            />
              <h2 className="text-xl font-bold">Hajar</h2>
            </div>
            <p className="text-white text-sm leading-relaxed max-w-xs">
              Menjaga komentar Youtube tetap bersih dan bermakna
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Product</h3>
            <ul className="space-y-3">
              {footerData.product.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-white hover:text-gray-400 transition-colors duration-100 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              {footerData.company.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-white hover:text-gray-400 transition-colors duration-100 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
            <ul className="space-y-3">
              {footerData.legal.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-white hover:text-gray-400 transition-colors duration-100 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-500 my-10"></div>
        <div className="text-center">
          <p className="text-white text-sm">
            © 2025 HAJAR Enterprise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
