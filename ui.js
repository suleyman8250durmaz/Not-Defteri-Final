// Notları verilen listeye render eden (görüntüleyen) fonksiyon
export const renderNotes = (notes, noteList) => {
  // Notlar listesini temizle (önceki içerikleri kaldır)
  noteList.innerHTML = '';
  
  // Her bir not için bir HTML öğesi oluştur ve listeye ekle
  notes.forEach(note => {
    // Yeni bir <div> öğesi oluştur
    const div = document.createElement('div');
    div.className = 'note-item'; // Not için CSS sınıfı ekle
    div.style.backgroundColor = note.color; // Notun rengini arka plan rengi olarak ayarla

    // Notun içeriğini HTML olarak ekle
    div.innerHTML = `
    <div>
      <div class="note-title fw-bold fs-5">${note.title || 'Başlıksız'}</div> <!-- Başlık -->
      <div class="note-text">${note.text}</div> <!-- Notun metni -->
      </div>
      <div class="note-actions mt-2"> <!-- Not için işlem butonları -->
        <!-- Düzenleme butonu -->
        <button class="btn btn-sm btn-secondary me-1 edit-btn" data-id="${note.id}">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <!-- Sabitleme butonu -->
        <button class="btn btn-sm btn-warning me-1 pin-btn" data-id="${note.id}">
          <i class="fa-solid fa-thumbtack"></i>
        </button>
        <!-- Silme butonu -->
        <button class="btn btn-sm btn-danger delete-btn" data-id="${note.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    // Oluşturulan <div> öğesini notlar listesine ekle
    noteList.appendChild(div);
  });
};

// Bir giriş alanını temizleyen (değerini sıfırlayan) fonksiyon
export const clearInput = (inputEl) => {
  inputEl.value = ''; // Giriş alanının değerini boş bir string yap
};
