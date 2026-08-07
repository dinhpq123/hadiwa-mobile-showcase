let activeApprovalTab = 'pending';

function setApprovalTab(tab) {
  activeApprovalTab = tab;
  document.querySelectorAll('.tab-pill').forEach(el => el.classList.remove('active'));
  const activePill = document.getElementById('pill-' + tab);
  if(activePill) activePill.classList.add('active');

  const pendingSec = document.getElementById('sec-pending');
  const approvedSec = document.getElementById('sec-approved');
  const rejectedSec = document.getElementById('sec-rejected');

  if(tab === 'pending') {
    pendingSec.style.display = 'block';
    approvedSec.style.display = 'none';
    rejectedSec.style.display = 'none';
  } else if(tab === 'approved') {
    pendingSec.style.display = 'none';
    approvedSec.style.display = 'block';
    rejectedSec.style.display = 'none';
  } else if(tab === 'rejected') {
    pendingSec.style.display = 'none';
    approvedSec.style.display = 'none';
    rejectedSec.style.display = 'block';
  } else {
    pendingSec.style.display = 'block';
    approvedSec.style.display = 'block';
    rejectedSec.style.display = 'block';
  }
}

function approveRecord(cardId) {
  if(confirm('Xác thực Face ID / Vân tay để phê duyệt tờ trình này?')) {
    const card = document.getElementById(cardId);
    if(card) {
      card.style.transition = 'all 0.4s';
      card.style.opacity = '0';
      setTimeout(() => { card.remove(); alert('Đã phê duyệt tờ trình thành công!'); }, 400);
    }
  }
}

function rejectRecord(cardId) {
  const reason = prompt('Nhập lý do từ chối tờ trình:');
  if(reason) {
    const card = document.getElementById(cardId);
    if(card) {
      card.style.transition = 'all 0.4s';
      card.style.opacity = '0';
      setTimeout(() => { card.remove(); alert('Đã từ chối tờ trình.'); }, 400);
    }
  }
}

function filterApprovals(val) {
  const cards = document.querySelectorAll('.approval-card');
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if(text.includes(val.toLowerCase())) card.style.display = 'block';
    else card.style.display = 'none';
  });
}
