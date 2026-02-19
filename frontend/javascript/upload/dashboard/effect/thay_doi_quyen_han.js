async function fetchUserPower() {
  const API_URL = 'https://learnpythonserver-sm.onrender.com/profile/get_power';

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Lỗi hệ thống: ${response.status}`);
    }

    const data = await response.json();
    const userPower = data.power || 'BASIC';
    const badge = document.querySelector('.am-badge-pro');

    if (badge) {
      const svgIcon = badge.querySelector('svg').outerHTML;
      badge.innerHTML = `${svgIcon} ${userPower.toUpperCase()}`;

      console.log('[UPDATE] Đã nâng cấp quyền hạn lên:', userPower);

      switch (userPower) {
        case 'admin-root':
          badge.style.cssText = `
            background-color: #D4AF37 !important;
            color: #1a1a1a !important;           
            border: none !important;           
            font-weight: 800 !important;
            padding: 2px 10px !important;       
            border-radius: 4px !important;
            opacity: 1 !important;                
            text-shadow: none !important;
            box-shadow: 2px 2px 0px rgba(0,0,0,0.2) !important;
          `;
          break;
        case 'PREMIUM':
          badge.style.cssText = `
            color: #A8A8A8 !important;
            border: 1px solid #A8A8A8 !important;
            font-weight: 600 !important;
            text-shadow: none !important;
          `;
          break;
        default:
          badge.style.cssText =
            'color: #ffffff !important; opacity: 1 !important;';
      }
      const planElement = document.querySelector('.am-item-sub');

      if (planElement) {
        const formattedPower =
          userPower.charAt(0).toUpperCase() + userPower.slice(1);
        planElement.innerHTML = `10 GB — ${formattedPower} plan`;
        console.log('[UPDATE] Đã nâng cấp gói lên: ' + newPlanName);
      }
    }
  } catch (error) {
    console.error('Nhưng! Có lỗi khi fetch quyền hạn:', error);
  }
}
document.addEventListener('DOMContentLoaded', fetchUserPower);
