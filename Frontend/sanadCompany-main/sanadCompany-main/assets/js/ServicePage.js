
  async function loadServices() {
    try {
      const res = await fetch('http://localhost:5261/api/Services');
      const services = await res.json();

      const container = document.getElementById('services-section');

      services.forEach(service => {
        
        const h5 = document.createElement('h5');
        h5.className = 'text-white mt-4';
        h5.textContent = service.title;
        container.appendChild(h5);

      
        if (service.details && service.details.length > 0) {
          const ul = document.createElement('ul');
          ul.className = 'text-white-50';

          service.details.forEach(detail => {
            const li = document.createElement('li');
            li.innerText = detail;
            ul.appendChild(li);
          });

          container.appendChild(ul);
        }
      });

      const finalText = document.createElement('p');
      finalText.className = 'text-white-50 mt-4';
      finalText.innerHTML = ` At Sanad Company, we are not just a service provider — we are an active strategic partner in leading your digital success and growth powered by AI. Whether you are starting out or expanding, we offer smart solutions that grow with your business.`;
      container.appendChild(finalText);

    } catch (error) {
      console.error('Failed to load services:', error);
    }
  }
async function loadServices2() {
  try {
    const res = await fetch('http://localhost:5261/api/Services');
    const services = await res.json();

    const container = document.getElementById('servicesContainer');

    services.forEach(service => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';

      const link = document.createElement('a');
      link.href = '#';
      link.className = 'text-decoration-none text-white';

      const card = document.createElement('div');
      card.className = 'card h-100 border-0 shadow-sm p-3';

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      const title = document.createElement('h5');
      title.className = 'card-title text-white';
      title.textContent = service.title;

      const description = document.createElement('p');
      description.className = 'card-text small text-white-50 mt-3';

      // دمج التفاصيل مع فواصل أو أسطر جديدة
      if (service.details && service.details.length > 0) {
        description.innerHTML = service.details.map(d => `<span>${d}</span>`).join('<br>');
      } else {
        description.innerText = 'No details available.';
      }

      cardBody.appendChild(title);
      cardBody.appendChild(description);
      card.appendChild(cardBody);
      link.appendChild(card);
      col.appendChild(link);
      container.appendChild(col);
    });

  } catch (error) {
    console.error('Failed to load services:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadServices);

  
  document.addEventListener('DOMContentLoaded', loadServices2);

