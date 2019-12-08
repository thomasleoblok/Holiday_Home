const holidayhomeUri = "api/holidayhome";
let holidayhomes = null;

$(document).ready(function() {
  getHolidayhomeData();
});

function getHolidayhomeCount(data) {
  const element = $("#counter");
  let name = "Homes";
  if (data) {
    element.text(data + " " + name);
  } 
  else {
    element.text("No " + name);
  }
}


function getHolidayhomeData() {
  $.ajax({
    type: "GET",
    url: holidayhomeUri,
    cache: false,
    success: function(data) {
      const tBody = $("#holiday-homes");

      $(tBody).empty();

      getHolidayhomeCount(data.length);

      $.each(data, function(key, item) {
        const tr = $("<tr></tr>")
          .append($("<td></td>").text(item.address))
          .append(
            $("<td></td>").append(
              $("<button>Edit</button>").on("click", function() {
                editItem(item.id);
              })
            )
          )
          .append($("<td></td>").text(item.rentalPrice))
          .append(
            $("<td></td>").append(
              $("<button>Edit</button>").on("click", function() {
                editItem(item.id);
              })
            )
          )
          .append($("<td></td>").text(item.homeOwnerid))
          .append(
            $("<td></td>").append(
              $("<button>Edit</button>").on("click", function() {
                editItem(item.id);
              })
            )
          )
          .append(
            $("<td></td>").append(
              $("<button>Delete</button>").on("click", function() {
                deleteItem(item.id);
              })
            )
          );

        tr.appendTo(tBody);
      });

      holidayhomes = data;
    }
  });
}

function addItem() {
  const item = {
    address: $("#add-address").val(),
    rentalPrice: $("#add-price").val(),
    homeOwnerid: $("#add-owner").val(),
  };

  $.ajax({
    type: "POST",
    accepts: "application/json",
    url: holidayhomeUri,
    contentType: "application/json",
    data: JSON.stringify(item),
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Something went wrong!");
    },
    success: function(result) {
      getHolidayhomeData();
      $("#add-address").val("");
    }
  });
}

function deleteItem(id) {
  $.ajax({
    url: holidayhomeUri + "/" + id,
    type: "DELETE",
    success: function(result) {
      getHolidayhomeData();
    }
  });
}

function editItem(id) {
  $.each(holidayhomes, function(key, item) {
    if (item.id === id) {
      $("#edit-address").val(item.address);
      $("#edit-price").val(item.rentalPrice);
      $("#edit-owner").val(item.homeOwnerid);
    }
  });
  $("#spoiler").css({ display: "block" });
}

$(".my-form").on("submit", function() {
  const item = {
    address: $("#edit-address").val(),
    rentalPrice: $("#edit-price").val(),
    homeOwnerid: $("#edit-owner").val()
  };

  $.ajax({
    url: holidayhomeUri + "/" + $("#edit-id").val(),
    type: "PUT",
    accepts: "application/json",
    contentType: "application/json",
    data: JSON.stringify(item),
    success: function(result) {
      getHolidayhomeData();
    }
  });

  closeInput();
  return false;
});

function closeInput() {
  $("#spoiler").css({ display: "none" });
}