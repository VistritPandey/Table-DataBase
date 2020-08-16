import prodb, {
  bulkcreate,
  createEle,
  getData,
  SortObj
} from "./module.js";


let db = prodb("Productdb", {
  products: `++id, name, quantity, price`
});

const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const quantity = document.getElementById("quantity");
const price = document.getElementById("price");

const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

btncreate.onclick = event => {
  
  let flag = bulkcreate(db.products, {
    name: proname.value,
    quantity: quantity.value,
    price: price.value
  });
  
  proname.value = quantity.value = price.value = "";

  
  getData(db.products, data => {
    userid.value = data.id + 1 || 1;
  });
  table();

  let insertmsg = document.querySelector(".insertmsg");
  getMsg(flag, insertmsg);
};


btnread.onclick = table;


btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
    
    db.products.update(id, {
      name: proname.value,
      quantity: quantity.value,
      price: price.value
    }).then((updated) => {
      
      let get = updated ? true : false;

     
      let updatemsg = document.querySelector(".updatemsg");
      getMsg(get, updatemsg);

      proname.value = quantity.value = price.value = "";
     
    })
  } else {
    console.log(`Please Select id: ${id}`);
  }
}

btndelete.onclick = () => {
  db.delete();
  db = prodb("Productdb", {
    products: `++id, name, quantity, price`
  });
  db.open();
  table();
  textID(userid);
  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
}

window.onload = event => {
 
  textID(userid);
};

function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";

  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }


  getData(db.products, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent = data.price === data[value] ? `₹ ${data[value]}` : data[value];
          });
        }
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
           
            i.onclick = editbtn;
          });
        })
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            
            i.onclick = deletebtn;
          });
        })
      });
    } else {
      notfound.textContent = "No record found in the database...!";
    }

  });
}

const editbtn = (event) => {
  let id = parseInt(event.target.dataset.id);
  db.products.get(id, function (data) {
    let newdata = SortObj(data);
    userid.value = newdata.id || 0;
    proname.value = newdata.name || "";
    quantity.value = newdata.quantity || "";
    price.value = newdata.price || "";
  });
}

const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  table();
}

function textID(textboxid) {
  getData(db.products, data => {
    textboxid.value = data.id + 1 || 1;
  });
}

function getMsg(flag, element) {
  if (flag) {
    
    element.className += " movedown";

    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 4000);
  }
}