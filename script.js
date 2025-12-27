const ingredientBody = document.getElementById('ingredient-body');
const addRowBtn = document.getElementById('add-row');

// Hàm tạo một dòng nguyên liệu mới
function createRow() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="ing-name" placeholder="Dầu dừa" required></td>
        <td><input type="number" class="ing-weight" placeholder="0"></td>
        <td><input type="date" class="ing-expiry"></td>
        <td><input type="date" class="ing-purchase"></td>
        <td><input type="number" class="ing-price" placeholder="0"></td>
        <td><input type="text" class="ing-vendor" placeholder="Shop A"></td>
        <td><button type="button" class="btn-remove">✕</button></td>
    `;
    
    // Gán sự kiện xóa dòng
    tr.querySelector('.btn-remove').addEventListener('click', () => tr.remove());
    return tr;
}

// Thêm dòng mặc định khi load trang
addRowBtn.addEventListener('click', () => ingredientBody.appendChild(createRow()));
ingredientBody.appendChild(createRow()); 

// Xử lý gửi form
document.getElementById('soap-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    const btn = document.getElementById('btn-save');
    const status = document.getElementById('status-msg');

    // Thu thập dữ liệu từ bảng nguyên liệu
    const ingredients = [];
    document.querySelectorAll('#ingredient-body tr').forEach(row => {
        const item = {
            name: row.querySelector('.ing-name').value,
            weight: row.querySelector('.ing-weight').value,
            expiry: row.querySelector('.ing-expiry').value,
            purchase: row.querySelector('.ing-purchase').value,
            price: row.querySelector('.ing-price').value,
            vendor: row.querySelector('.ing-vendor').value
        };
        if(item.name) ingredients.push(`${item.name}(${item.weight}g - HSD:${item.expiry} - Giá:${item.price})`);
    });

    const data = {
        name: document.getElementById('soap-name').value,
        date: document.getElementById('make-date').value,
        superfat: document.getElementById('superfat').value + '%',
        cureDate: document.getElementById('cure-date').value,
        scent: document.getElementById('scent').value,
        quality: document.getElementById('quality').value,
        recipeDetail: ingredients.join(' | ') // Gộp các nguyên liệu thành 1 chuỗi để lưu vào 1 ô trên Sheet
    };

    btn.disabled = true;
    status.innerText = 'Đang lưu dữ liệu...';

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify(data)
    })
    .then(() => {
        status.style.color = 'green';
        status.innerText = '✅ Thành công! Dữ liệu đã được gửi.';
        // Có thể reset form ở đây
    })
    .catch(err => {
        status.style.color = 'red';
        status.innerText = '❌ Lỗi: ' + err;
    })
    .finally(() => {
        btn.disabled = false;
    });
});
