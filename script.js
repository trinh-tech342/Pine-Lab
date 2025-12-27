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
    
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvqdIIsGgeGyyM8csVageahVif4LA8J5wjNWfkZcNJXNaGDjZ-mjye0xcVVlqDsQA3/exec';
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
// ... (giữ nguyên phần createRow và addRowBtn từ câu trả lời trước) ...

document.getElementById('soap-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvqdIIsGgeGyyM8csVageahVif4LA8J5wjNWfkZcNJXNaGDjZ-mjye0xcVVlqDsQA3/exec'; // Nhớ cập nhật URL mới sau khi deploy
    const btn = document.getElementById('btn-save');
    const status = document.getElementById('status-msg');

    // Thu thập danh sách nguyên liệu dưới dạng Mảng
    const ingredientsArray = [];
    document.querySelectorAll('#ingredient-body tr').forEach(row => {
        const name = row.querySelector('.ing-name').value;
        if (name) {
            ingredientsArray.push({
                name: name,
                weight: row.querySelector('.ing-weight').value,
                expiry: row.querySelector('.ing-expiry').value,
                purchase: row.querySelector('.ing-purchase').value,
                price: row.querySelector('.ing-price').value,
                vendor: row.querySelector('.ing-vendor').value
            });
        }
    });

    const data = {
        name: document.getElementById('soap-name').value,
        date: document.getElementById('make-date').value,
        superfat: document.getElementById('superfat').value + '%',
        cureDate: document.getElementById('cure-date').value,
        scent: document.getElementById('scent').value,
        quality: document.getElementById('quality').value,
        ingredientsList: ingredientsArray // Gửi mảng dữ liệu sạch
    };

    btn.disabled = true;
    status.innerText = 'Đang đồng bộ dữ liệu sang 2 trang tính...';

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
    })
    .then(() => {
        status.style.color = 'green';
        status.innerText = '✅ Đã lưu! Mẻ xà phòng và Nguyên liệu đã được tách riêng.';
        document.getElementById('soap-form').reset();
        document.getElementById('ingredient-body').innerHTML = ''; 
        document.getElementById('ingredient-body').appendChild(createRow());
    })
    .catch(err => {
        status.style.color = 'red';
        status.innerText = '❌ Lỗi kết nối: ' + err;
    })
    .finally(() => {
        btn.disabled = false;
    });
});
