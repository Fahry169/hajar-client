import {
  ArrowSquareOutIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@phosphor-icons/react";

const CaraKerja = () => {
  const Langkah = [
    {
      icon: ShieldCheckIcon,
      Title: "Login",
      desc: "Login menggunakan akun Google/YouTube. Setelah pengguna memberikan izin, sistem HAJAR akan mengakses komentar pada video YouTube milik pengguna secara aman",
    },
    {
      icon: MagnifyingGlassIcon,
      Title: "Deteksi",
      desc: "Sistem menggunakan analisis berbasis Machine Learning untuk memindai dan mengidentifikasi komentar yang mengandung unsur spam atau promosi judi online.",
    },
    {
      icon: TrashIcon,
      Title: "Hapus",
      desc: "Komentar yang terdeteksi sebagai spam akan ditampilkan kepada pengguna untuk ditinjau sebelum dihapus.",
    },
  ];

  return (
    <div
      className="bg-red-500 min-h-screen flex items-center justify-center py-20 px-4"
      id="cara-kerja"
    >
      <div className="text-white flex flex-col items-center justify-center w-full max-w-7xl">
        <div className="text-center mb-12 flex flex-col items-center gap-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
            Hanya Butuh 3 Langkah
          </h1>
          <p className="text-lg font-light">
            Hapus Komentar Judi Online dengan Mudah
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 w-full">
          {Langkah.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="bg-red-400 bg-opacity-80 backdrop-blur-sm rounded-lg p-6 flex flex-col items-start text-white relative cursor-pointer
                hover:bg-red-300 hover:bg-opacity-90 hover:shadow-lg hover:scale-105 hover:shadow-red-900/20
                transition-all duration-300 ease-in-out transform"
              >
                <div className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity duration-200">
                  <ArrowSquareOutIcon className="w-5 h-5 text-white" />
                </div>
                <div className="mb-6 transform transition-transform duration-300 hover:scale-110">
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-2xl font-semibold mb-4 text-white">
                  {item.Title}
                </h2>

                <p className="text-white text-sm leading-relaxed opacity-90">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CaraKerja;
