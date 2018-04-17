(function() {
  window.$ = window.jQuery = require('jquery');

  function renderDistricts(wrapper)
  {
    $.ajax({
      url: __props.url,
      success: function(districts) {
        if(districts.length) {
          var table = $('<table>').addClass('table').addClass('table-striped');
          var headings = $('<thead>')
            .append(
              $('<tr>')
                .append($('<th>').text('No.'))
                .append($('<th>').text('Code'))
                .append($('<th>').text('Name'))
                .append($('<th>').text('Seat Name'))
                .append($('<th>').text('Actions'))
          );

          var tbody = $('<tbody>');

          table.append(headings).append(tbody);

          $.each(districts, function(i, district) {
            var tr = $('<tr>')
              .append($('<td>').text(i+1))
              .append($('<td>').text(district.code))
              .append($('<td>').text(district.name))
              .append($('<td>').text(district.seat_name))
              .append($('<td>').text(district.created_at))
              .append('<td><a href=/district/show/'+ district.id + '>Show</a></td>');

            tbody.append(tr);
          });

          wrapper.append(table);
        }
        else {
          wrapper.append(
            $('<div>').text('No records found')
          );
        }
      },
    });
  }

  function renderDistrict(wrapper)
  {
    $.ajax({
      url: __props.url,
      success: function(district) {
        var table = $('<table>').addClass('table').addClass('table-striped');
        var headings = $('<thead>')
          .append(
            $('<tr>')
              .append($('<th>').text('Attribute'))
              .append($('<th>').text('Value'))
          );

        var tbody = $('<tbody>');

        table.append(headings).append(tbody);

        tbody
          .append($('<tr>')
            .append($('<td>').text('Code'))
            .append($('<td>').text(district.code))
          )
          .append($('<tr>')
            .append($('<td>').text('Name'))
            .append($('<td>').text(district.name))
          )
          .append($('<tr>')
            .append($('<td>').text('Seat Name'))
            .append($('<td>').text(district.seat_name))
          );
        wrapper.append(table);
      },
    });
  }

  if($('#district-index')) {
    renderDistricts($('#district-index'));
  }

  if($('#district-show')) {
    renderDistrict($('#district-show'));
  }
})();
