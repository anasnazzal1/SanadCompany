   const serviceApi = "http://localhost:5261/api/Services";
    const productApi = "http://localhost:5261/api/products";

    // تحميل الخدمات وعرضها
    function loadServices() {
      axios.get(serviceApi).then((res) => {
        const list = document.getElementById("servicesList");
        list.innerHTML = "";
        res.data.forEach((service) => {
          list.innerHTML += `
            <div class="col">
              <div class="card shadow h-100">
                <div class="card-body">
                  <h5 class="card-title text-primary">${service.title}</h5>
                  <p class="card-text">${service.description || ""}</p>
                  <div class="d-flex justify-content-between mt-3">
                    <button class="btn btn-sm btn-warning" onclick="openEditModal(${service.id})">✏️ تعديل</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteService(${service.id})">🗑️ حذف</button>
                  </div>
                </div>
              </div>
            </div>`;
        });
      });
    }

    // حذف خدمة
    function deleteService(id) {
      if (confirm("تأكيد حذف الخدمة؟")) {
        axios.delete(`${serviceApi}/${id}/deleteService`).then(loadServices);
      }
    }

    // إنشاء خدمة
    const createServiceForm = document.getElementById("createServiceForm");
    createServiceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(createServiceForm);
      axios.post(`${serviceApi}/createService`, data).then(() => {
        bootstrap.Modal.getInstance(document.getElementById("createModal")).hide();
        createServiceForm.reset();
        loadServices();
      });
    });

    // فتح مودال تعديل الخدمة
    function openEditModal(id) {
      axios.get(serviceApi).then((res) => {
        const service = res.data.find((s) => s.id === id);
        const form = document.getElementById("editServiceForm");
        form.id.value = service.id;
        form.Title.value = service.title;
        form.Description.value = service.description;
        form["Details[]"][0].value = service.details[0] || "";
        form["Details[]"][1].value = service.details[1] || "";
        new bootstrap.Modal(document.getElementById("editModal")).show();
      });
    }

    // تعديل خدمة
    const editServiceForm = document.getElementById("editServiceForm");
    editServiceForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const id = editServiceForm.id.value;
      const data = new FormData(editServiceForm);
      axios.put(`${serviceApi}/${id}/updateService`, data).then(() => {
        bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
        editServiceForm.reset();
        loadServices();
      });
    });

   // تحميل المنتجات وعرضها
function loadProducts() {
  axios.get(productApi).then((res) => {
    const list = document.getElementById("productsList");
    list.innerHTML = "";
    res.data.forEach((product) => {
      list.innerHTML += `
        <div class="col">
          <div class="card shadow h-100">
            <div class="card-body">
              <h5 class="card-title text-success">${product.title}</h5>
              <p class="card-text">${product.description || ""}</p>
              <div class="d-flex justify-content-between mt-3">
                <button class="btn btn-sm btn-warning btn-edit" onclick="openEditProductModal(${product.id})">\u270F\ufe0f تعديل</button>
                <button class="btn btn-sm btn-danger " onclick="deleteProduct(${product.id})">\ud83d\uddd1\ufe0f حذف</button>
              </div>
            </div>
          </div>
        </div>`;
    });
  });
}

// حذف منتج
function deleteProduct(id) {
  if (confirm("تأكيد حذف المنتج؟")) {
    axios.delete(`${productApi}/${id}/DeleteProduct`).then(loadProducts);
  }
}

const editThumbnailsInput = document.getElementById("editThumbnails");
const editThumbnailsPreview = document.getElementById("editThumbnailsPreview");
const editMainImageSelector = document.getElementById("editMainImageSelector");
const editMainImageIndex = document.getElementById("editMainImageIndex");
let selectedEditMainIndex = null;

const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'), {});
const apiBaseUrlProdact = 'http://localhost:5261/api/products';

async function openEditProductModal(productId) {
  try {
    const res = await fetch(`${apiBaseUrlProdact}/${encodeURIComponent(productId)}/ProductDetails`);
    if (!res.ok) throw new Error(`Failed to get product details (${res.status})`);
    const product = await res.json();

    document.getElementById('editProductId').value = productId;
    document.getElementById('editTitle').value = product.title || '';
    document.getElementById('editDescription').value = product.description || '';
    document.getElementById('editLongDescription').value = product.longDescription || '';
    document.getElementById('editYear').value = product.year || '';
    document.getElementById('editCategory').value = product.category || '';
    document.getElementById('editTags').value = product.tags || '';
    document.getElementById('editBuyLink').value = product.buyLink || '';
    document.getElementById('editDetailsLink').value = product.detailsLink || '';
    document.getElementById('editDemoLink').value = product.demoLink || '';

    editThumbnailsInput.value = '';
    editThumbnailsPreview.innerHTML = '';
    editMainImageSelector.innerHTML = '';
    selectedEditMainIndex = null;
    editMainImageIndex.value = '';

    editProductModal.show();
  } catch (error) {
    alert('Error fetching product details: ' + error.message);
  }
}

document.getElementById('editProductForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const productId = document.getElementById('editProductId').value;
  if (!productId) {
    alert('Product ID missing!');
    return;
  }

  const formData = new FormData();
  const fields = ['editTitle', 'editDescription', 'editLongDescription', 'editYear', 'editCategory', 'editTags', 'editBuyLink', 'editDetailsLink', 'editDemoLink'];
  fields.forEach(id => {
    const val = document.getElementById(id).value.trim();
    if (val) {
      const key = id.replace('edit', '');
      formData.append(key, val);
    }
  });



  const thumbnailsInput = document.getElementById('editThumbnails');
  if (thumbnailsInput.files.length > 0) {
    for (const file of thumbnailsInput.files) {
      formData.append('Thumbnails', file);
    }
  }

  try {
    const res = await fetch(`${apiBaseUrlProdact}/${encodeURIComponent(productId)}/updateproductinfo`, {
      method: 'PUT',
      body: formData
    });

    if (res.ok) {
      alert('Product updated successfully!');
      editProductModal.hide();
      loadProducts();
    } else {
      const errorText = await res.text();
      alert(`Failed to update product: ${res.status} ${res.statusText}\n${errorText}`);
    }
  } catch (error) {
    alert('Error sending update request: ' + error.message);
  }
});

editThumbnailsInput.addEventListener("change", () => {
  const files = Array.from(editThumbnailsInput.files);

  if (files.length > 3) {
    alert("يمكنك اختيار حتى 3 صور فقط.");
    editThumbnailsInput.value = "";
    editThumbnailsPreview.innerHTML = "";
    editMainImageSelector.innerHTML = "";
    selectedEditMainIndex = null;
    return;
  }

  editThumbnailsPreview.innerHTML = "";
  editMainImageSelector.innerHTML = "";
  selectedEditMainIndex = null;

  files.forEach((file, i) => {
    const url = URL.createObjectURL(file);

    const imgPreview = document.createElement("img");
    imgPreview.src = url;
    imgPreview.style.width = "80px";
    imgPreview.style.height = "80px";
    imgPreview.style.objectFit = "cover";
    imgPreview.classList.add("border", "rounded");
    editThumbnailsPreview.appendChild(imgPreview);

    const label = document.createElement("label");
    label.className = "position-relative";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "editMainImageRadio";
    radio.value = i;
    radio.style.position = "absolute";
    radio.style.top = "5px";
    radio.style.left = "5px";
    radio.required = true;

    radio.addEventListener("change", () => {
      selectedEditMainIndex = i;
      editMainImageIndex.value = i;
    });

    label.appendChild(radio);

    const imgMain = document.createElement("img");
    imgMain.src = url;
    imgMain.style.width = "80px";
    imgMain.style.height = "80px";
    imgMain.style.objectFit = "cover";
    imgMain.classList.add("border", "rounded");

    label.appendChild(imgMain);
    editMainImageSelector.appendChild(label);
  });
});

function loadCategories() {
  const categorySelect = document.getElementById("categorySelect");
  categorySelect.innerHTML = '<option value="" disabled selected>جارٍ التحميل...</option>';
  axios.get(productApi)
    .then(res => {
      const categories = new Set();
      res.data.forEach(product => {
        if (product.category) categories.add(product.category);
      });
      categorySelect.innerHTML = '<option value="" disabled selected>اختر الفئة</option>';
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      });
    })
    .catch(() => {
      categorySelect.innerHTML = '<option value="" disabled selected>فشل تحميل الفئات</option>';
    });
}


const thumbnailsInput = document.getElementById("thumbnailsInput");
const thumbnailsPreview = document.getElementById("thumbnailsPreview");
const mainImageSelector = document.getElementById("mainImageSelector");
let selectedMainIndex = null;

thumbnailsInput.addEventListener("change", () => {
  const files = Array.from(thumbnailsInput.files);

  if (files.length > 3) {
    alert("يمكنك اختيار حتى 3 صور فقط.");
    thumbnailsInput.value = "";
    thumbnailsPreview.innerHTML = "";
    mainImageSelector.innerHTML = "";
    selectedMainIndex = null;
    return;
  }

  thumbnailsPreview.innerHTML = "";
  mainImageSelector.innerHTML = "";
  selectedMainIndex = null;

  files.forEach((file, i) => {
    const url = URL.createObjectURL(file);

    // عرض في المعاينة
    const imgPreview = document.createElement("img");
    imgPreview.src = url;
    imgPreview.style.width = "80px";
    imgPreview.style.height = "80px";
    imgPreview.style.objectFit = "cover";
    imgPreview.classList.add("border", "rounded");
    thumbnailsPreview.appendChild(imgPreview);

    // اختيار الصورة الرئيسية
    const label = document.createElement("label");
    label.className = "position-relative";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "mainImageRadio";
    radio.value = i;
    radio.style.position = "absolute";
    radio.style.top = "5px";
    radio.style.left = "5px";
    radio.required = true;

    radio.addEventListener("change", () => {
      selectedMainIndex = i;
    });

    label.appendChild(radio);

    const imgMain = document.createElement("img");
    imgMain.src = url;
    imgMain.style.width = "80px";
    imgMain.style.height = "80px";
    imgMain.style.objectFit = "cover";
    imgMain.classList.add("border", "rounded");

    label.appendChild(imgMain);
    mainImageSelector.appendChild(label);
  });
});

const createProductForm = document.getElementById("createProductForm");
createProductForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const form = createProductForm;
  const data = new FormData();

  // الحقول النصية
  data.append("Title", form.Title.value);
  data.append("Description", form.Description.value);
  data.append("LongDescription", form.LongDescription.value);
  data.append("Year", form.Year.value);
  data.append("Category", form.Category.value);
  data.append("Tags", form.Tags.value);
  data.append("BuyLink", form.BuyLink.value);
  data.append("DetailsLink", form.DetailsLink.value);
  data.append("DemoLink", form.DemoLink.value);

  // الصور
  const files = Array.from(thumbnailsInput.files);
  if (files.length === 0) {
    alert("يرجى اختيار الصور المصغرة واختيار واحدة كصورة رئيسية.");
    return;
  }

  if (selectedMainIndex === null || selectedMainIndex >= files.length) {
    alert("يرجى اختيار الصورة الرئيسية.");
    return;
  }

  // إضافة الصورة الرئيسية
  const mainImageFile = files[selectedMainIndex];
  data.append("ImageUrl", mainImageFile);

  // إضافة جميع الصور كمصغرات (بما في ذلك الصورة الرئيسية)
  files.forEach((file) => {
    data.append("Thumbnails", file);
  });

  // إرسال الطلب
  axios
    .post(`${productApi}/CreateProduct`, data)
    .then(() => {
      bootstrap.Modal.getInstance(document.getElementById("createProductModal")).hide();
      createProductForm.reset();
      thumbnailsPreview.innerHTML = "";
      mainImageSelector.innerHTML = "";
      selectedMainIndex = null;
      loadProducts();
      alert("✅ تم إضافة المنتج بنجاح!");
    })
    .catch((err) => {
      alert("❌ حدث خطأ أثناء الإضافة:\n" + (err.response?.data || err.message));
      console.error(err);
    });
});




    // لتحميل البيانات عند بداية الصفحة
    loadServices();
    loadProducts();

    // ملاحظة: تحتاج وظيفة openEditProductModal لتعديل منتج (إذا أردت إضافتها)