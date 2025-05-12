// UUID kütüphanesini içe aktar (benzersiz ID oluşturmak için kullanılır)
import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@9.0.0/dist/esm-browser/index.js';

// Tüm notları yerel depolamadan alır ve sabitlenmiş notları öncelikli olarak sıralar
export const getNotes = () => {
  try {
    // Yerel depolamadan notları JSON formatında al ve JavaScript nesnesine dönüştür
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    // Sabitlenmiş notları (pinned) öncelikli olacak şekilde sırala
    return notes.sort((a, b) => (b.pinned === true) - (a.pinned === true));
  } catch (e) {
    // Hata durumunda konsola hata mesajı yazdır ve boş bir dizi döndür
    console.error('Notlar yüklenirken hata:', e);
    return [];
  }
};

// Notları yerel depolamaya kaydeder
export const saveNotes = (notes) => {
  try {
    // Notları JSON formatına çevir ve yerel depolamaya kaydet
    localStorage.setItem('notes', JSON.stringify(notes));
  } catch (e) {
    // Hata durumunda konsola hata mesajı yazdır
    console.error('Notlar kaydedilirken hata:', e);
  }
};

// Yeni bir not ekler
export const addNote = (title, text, color) => {
  // Mevcut notları al
  const notes = getNotes();
  // Yeni notu notlar listesine ekle
  notes.push({
    id: uuidv4(), // Benzersiz bir ID oluştur
    title, // Notun başlığı
    text, // Notun metni
    color, // Notun rengi
    pinned: false // Varsayılan olarak sabitlenmemiş
  });
  // Güncellenmiş notlar listesini kaydet
  saveNotes(notes);
};

// Belirtilen ID'ye sahip bir notu siler
export const deleteNote = (id) => {
  // Mevcut notları al
  const notes = getNotes();
  // Silinecek not hariç diğer notları filtrele
  const updatedNotes = notes.filter(note => note.id !== id);
  // Güncellenmiş notlar listesini kaydet
  saveNotes(updatedNotes);
};

// Belirtilen ID'ye sahip bir notun sabitlenme durumunu değiştirir
export const togglePinNote = (id) => {
  // Mevcut notları al
  const notes = getNotes();
  // Belirtilen notun pinned değerini tersine çevir
  const updatedNotes = notes.map(note =>
    note.id === id ? { ...note, pinned: !note.pinned } : note
  );
  // Güncellenmiş notlar listesini kaydet
  saveNotes(updatedNotes);
};

// Belirtilen ID'ye sahip bir notu günceller
export const updateNote = (id, newTitle, newText, newColor) => {
  // Mevcut notları al
  const notes = getNotes();
  // Belirtilen notun başlık, metin ve renk değerlerini güncelle
  const updatedNotes = notes.map(note =>
    note.id === id ? { ...note, title: newTitle, text: newText, color: newColor } : note
  );
  // Güncellenmiş notlar listesini kaydet
  saveNotes(updatedNotes);
};
