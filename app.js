// Gerekli modülleri içe aktar
import { addNote, deleteNote, getNotes, togglePinNote, updateNote } from './storage.js';
import { renderNotes, clearInput } from './ui.js';

// DOM öğelerini seç
const titleInput = document.querySelector('#note-title'); // Not başlık alanı
const noteInput = document.querySelector('#note-input'); // Not metin alanı
const colorPicker = document.querySelector('#color-picker'); // Renk seçici
const addButton = document.querySelector('#add-note'); // Not ekle/güncelle butonu
const noteList = document.querySelector('#note-list'); // Notların listelendiği alan
const themeToggle = document.querySelector('#theme-toggle'); // Tema değiştirme butonu
const errorToast = document.querySelector('#error-toast'); // Hata mesajı için toast

// Düzenleme durumunu takip eden değişkenler
let isEditing = false; // Şu anda düzenleme yapılıp yapılmadığını belirler
let editingId = null; // Düzenlenen notun ID'si

// Uygulamayı başlatan fonksiyon
const initializeApp = () => {
  // Kaydedilmiş temayı yükle veya varsayılan olarak "light" temayı kullan
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.className = savedTheme; // Temayı body'ye uygula
  themeToggle.innerHTML = savedTheme === 'light'
    ? '<i class="fa-solid fa-moon"></i>' // Light tema için ikon
    : '<i class="fa-solid fa-sun"></i>'; // Dark tema için ikon

  // Notları render et
  renderNotes(getNotes(), noteList);

  // Not ekle/güncelle butonuna tıklama olayını dinle
  addButton.addEventListener('click', handleAddOrUpdate);

  // Enter tuşuna basıldığında not ekle/güncelle
  noteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Enter tuşunun varsayılan davranışını engelle
      handleAddOrUpdate();
    }
  });

  // Tema değiştirme butonuna tıklama olayını dinle
  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.className === 'light' ? 'dark' : 'light'; // Temayı değiştir
    document.body.className = newTheme; // Yeni temayı uygula
    localStorage.setItem('theme', newTheme); // Yeni temayı yerel depolamaya kaydet
    themeToggle.innerHTML = newTheme === 'light'
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  });

  // Not listesinde tıklama olaylarını dinle
  noteList.addEventListener('click', (e) => {
    const target = e.target.closest('button'); // Tıklanan butonu bul
    if (!target) return; // Eğer bir butona tıklanmadıysa işlemi durdur

    const id = target.dataset.id; // Tıklanan notun ID'sini al

    // Silme butonuna tıklanırsa
    if (target.classList.contains('delete-btn')) {
      deleteNote(id); // Notu sil
      renderNotes(getNotes(), noteList); // Notları yeniden render et
      showToast('Not silindi.'); // Kullanıcıya bilgi ver
    }

    // Sabitleme butonuna tıklanırsa
    if (target.classList.contains('pin-btn')) {
      togglePinNote(id); // Sabitleme durumunu değiştir
      renderNotes(getNotes(), noteList); // Notları yeniden render et
    }

    // Düzenleme butonuna tıklanırsa
    if (target.classList.contains('edit-btn')) {
      const note = getNotes().find(n => n.id === id); // Düzenlenecek notu bul
      if (note) {
        titleInput.value = note.title || ''; // Başlığı giriş alanına koy
        noteInput.value = note.text; // Metni giriş alanına koy
        colorPicker.value = note.color; // Rengi renk seçiciye koy
        isEditing = true; // Düzenleme durumunu aktif et
        editingId = id; // Düzenlenen notun ID'sini kaydet
        addButton.textContent = 'Notu Güncelle'; // Buton metnini değiştir
      }
    }
  });
};

// Not ekleme veya güncelleme işlemini gerçekleştiren fonksiyon
const handleAddOrUpdate = () => {
  const title = titleInput.value.trim(); // Başlık girişini al ve boşlukları temizle
  const text = noteInput.value.trim(); // Metin girişini al ve boşlukları temizle
  const color = colorPicker.value; // Renk seçiciden rengi al

  if (!text) {
    // Eğer metin boşsa kullanıcıya uyarı göster
    showToast('Lütfen boş bir not girin.');
    return;
  }

  if (isEditing && editingId) {
    // Eğer düzenleme yapılıyorsa
    updateNote(editingId, title, text, color); // Notu güncelle
    showToast('Not güncellendi.'); // Kullanıcıya bilgi ver
    addButton.textContent = 'Not Ekle'; // Buton metnini sıfırla
    isEditing = false; // Düzenleme durumunu sıfırla
    editingId = null; // Düzenlenen ID'yi sıfırla
  } else {
    // Yeni not ekleme
    addNote(title, text, color); // Yeni not ekle
    showToast('Not eklendi.'); // Kullanıcıya bilgi ver
  }

  renderNotes(getNotes(), noteList); // Notları yeniden render et
  clearInput(titleInput); // Başlık girişini temizle
  clearInput(noteInput); // Metin girişini temizle
  colorPicker.value = '#ffffff'; // Renk seçiciyi sıfırla
};

// Kullanıcıya mesaj gösteren fonksiyon
const showToast = (message) => {
  errorToast.querySelector('.toast-body').textContent = message; // Mesajı toast içine koy
  const toast = new bootstrap.Toast(errorToast); // Bootstrap toast'ı oluştur
  toast.show(); // Toast'ı göster
};

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', initializeApp);
