const holidayhomeUri = "api/holidayhome";
let holidayhomes = null;

$(document).ready(function() {
  getData();
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
          .append($("<td></td>").text(item.Address))
          .append(
            $("<td></td>").append(
              $("<button>Edit</button>").on("click", function() {
                editItem(item.Id);
              })
            )
          )
          .append($("<td></td>").text(item.RentalPrice))
          .append(
            $("<td></td>").append(
              $("<button>Edit</button>").on("click", function() {
                editItem(item.Id);
              })
            )
          )
          .append($("<td></td>").text(item.HomeOwnerId))
          .append(
            $("<td></td>").append(
              $("<button>Edit</button>").on("click", function() {
                editItem(item.Id);
              })
            )
          )
          .append(
            $("<td></td>").append(
              $("<button>Delete</button>").on("click", function() {
                deleteItem(item.Id);
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
    Address: $("#add-address").val(),
    RentalPrice: $("#add-price").val(),
    HomeOwnerId: $("#add-owner").val(),
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
      getData();
      $("#add-address").val("");
    }
  });
}

function deleteItem(Id) {
  $.ajax({
    url: holidayhomeUri + "/" + Id,
    type: "DELETE",
    success: function(result) {
      getHolidayhomeData();
    }
  });
}

function editItem(id) {
  $.each(holidayhomes, function(key, item) {
    if (item.Id === Id) {
      $("#edit-address").val(item.Address);
      $("#edit-price").val(item.RentalPrice);
      $("#edit-owner").val(item.HomeOwnerId);
    }
  });
  $("#spoiler").css({ display: "block" });
}

$(".my-form").on("submit", function() {
  const item = {
    Address: $("#edit-address").val(),
    RentalPrice: $("#edit-price").val(),
    HomeOwnerId: $("#edit-owner").val()
  };

  $.ajax({
    url: holidayhomeUri + "/" + $("#edit-id").val(),
    type: "PUT",
    accepts: "application/json",
    contentType: "application/json",
    data: JSON.stringify(item),
    success: function(result) {
      getData();
    }
  });

  closeInput();
  return false;
});

function closeInput() {
  $("#spoiler").css({ display: "none" });
}