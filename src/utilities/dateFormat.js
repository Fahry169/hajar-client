export const formatToWIB = (publishedAt) => {
  try {
    const date = new Date(publishedAt);
    
    const jakartaDate = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
    
    const day = jakartaDate.getDate();
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const month = monthNames[jakartaDate.getMonth()];
    const year = jakartaDate.getFullYear();
    
    const hours = jakartaDate.getHours().toString().padStart(2, '0');
    const minutes = jakartaDate.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return publishedAt;
  }
};

export const formatDateOnly = (publishedAt) => {
  try {
    const date = new Date(publishedAt);
    
    const options = {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('id-ID', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return publishedAt;
  }
};

export const formatRelativeTime = (publishedAt) => {
  try {
    const date = new Date(publishedAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} detik yang lalu`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} hari yang lalu`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} bulan yang lalu`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} tahun yang lalu`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return publishedAt;
  }
};