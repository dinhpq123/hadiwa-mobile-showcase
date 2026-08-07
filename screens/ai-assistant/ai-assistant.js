function sendAiMsg(text) {
  if(!text || !text.trim()) return;
  const chatBox = document.getElementById('aiChatBox');
  if(!chatBox) return;

  const userMsg = `<div style="text-align:right;margin-bottom:8px"><span style="background:#7C3AED;color:#fff;padding:10px 14px;border-radius:16px 16px 2px 16px;font-size:12px;display:inline-block">${text}</span></div>`;
  chatBox.innerHTML += userMsg;

  const input = document.getElementById('aiInput');
  if(input) input.value = '';

  setTimeout(() => {
    const aiMsg = `<div style="text-align:left;margin-bottom:8px;display:flex;gap:8px"><img src="../../_archive/hadiwa-mobile/assets/image-icon/mascot-cwa-new.png" style="width:28px;height:28px;object-fit:contain" onerror="this.src='https://cdn-icons-png.flaticon.com/512/4712/4712109.png'"/><span style="background:#141c33;border:1px solid #202b48;color:#fff;padding:10px 14px;border-radius:16px 16px 16px 2px;font-size:12px;display:inline-block">Dữ liệu vận hành: Hệ thống hoạt động bình thường, sản lượng đạt 48.950 m3.</span></div>`;
    chatBox.innerHTML += aiMsg;
  }, 500);
}

function clearAiChat() {
  const chatBox = document.getElementById('aiChatBox');
  if(chatBox) chatBox.innerHTML = '';
}
