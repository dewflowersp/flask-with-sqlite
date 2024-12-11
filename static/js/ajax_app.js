function validateForm($this, url, id = null) {
    var string = id;
    var empty = false;
    var input = $($this).parents("tr").find('input[type="text"]');
    input.each(function(){
        if(!$(this).val()){
            $($this).addClass("error");
            empty = true;
        } else {
            $($this).removeClass("error");
        }
    });
    if(!empty) {
        var txtname = $("#txtname").val();
        var txtdepartment = $("#txtdepartment").val();
        var txtphone = $("#txtphone").val();
        $.post(url, { string: string, txtname: txtname, txtdepartment: txtdepartment, txtphone: txtphone}, function(data) {
            $("#displaymessage").html(data);
            $("#displaymessage").show();
        });
        input.each(function(){
            $(this).parent("td").html($(this).val());
        });
    }
    return empty;
}
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    // Append table with add row form on add new button click
    $(".add-new").click(function() {
        if($("table tbody tr").length == 0) {
            var id = 1;
        } else {
            var id = parseInt($("table tbody tr:last-child").find(".edit").data("id")) + 1;
        }
        var actions ='<a class="add" title="Add" data-toggle="tooltip" data-id="' + id + '"><i class="fa fa-user-plus"></i></a>'
                + '<a class="edit" title="Edit" data-toggle="tooltip" data-id="' + id + '"><i class="fa fa-pencil"></i></a>'
                +'<a class="delete" title="Delete" data-toggle="tooltip" data-id="' + id + '"><i class="fa fa-trash-o"></i></a>';

        $(this).attr("disabled", "disabled");
        var row = '<tr>' +
            '<td><input type="text" class="form-control" name="name" id="txtname"></td>' +
            '<td><input type="text" class="form-control" name="department" id="txtdepartment"></td>' +
            '<td><input type="text" class="form-control" name="phone" id="txtphone"></td>' +
        '<td>' + actions + '</td>' +
        '</tr>';
        $("table").append(row);
        console.log(id);
        $("table tbody tr:last-child").find(".add, .edit, .delete").toggle();
        $('[data-toggle="tooltip"]').tooltip();
 
    });
   
    // Add row on add button click
    $(document).on("click", ".add", function(){
        var empty = validateForm($(this), "/ajax_add");
        
        if(!empty) {
            $(this).parents("tr").find(".add, .edit, .delete").toggle();
            $(".add-new").removeAttr("disabled");
        } else {
            $(this).parents("tr").find(".error").first().focus();
        }
    });

    // Delete row on delete button click
    $(document).on("click", ".delete", function(){
        $(this).parents("tr").remove();
        $(".add-new").removeAttr("disabled");
        var id = $(this).data("id");
        var string = id;
        $.post("/ajax_delete", { string: string}, function(data) {
            $("#displaymessage").html(data);
            $("#displaymessage").show();
        });
    });

    // update rec row on edit button click
    $(document).on("click", ".update", function() {
        var id = $(this).data("id");
        var empty = validateForm(this, "/ajax_update", id);
        
        if(!empty) {
            $(this).removeClass("update").addClass("add").attr('data-original-title', 'Add');
            $(this).parents("tr").find(".add, .edit, .delete").toggle();
            $(".add-new").removeAttr("disabled");
        } else {
            $(this).parents("tr").find(".error").first().focus();
        }
    });

    // Edit row on edit button click
    $(document).on("click", ".edit", function(){  
        $(this).parents("tr").find("td:not(:last-child)").each(function(i){
            if (i=='0'){
                var idname = 'txtname';
            } else if (i=='1'){
                var idname = 'txtdepartment';
            } else if (i=='2'){
                var idname = 'txtphone';
            } else{} 
            $(this).html('<input type="text" name="updaterec" id="' + idname + '" class="form-control" value="' + $(this).text() + '">');
        });  
        $(this).parents("tr").find(".add, .edit, .delete").toggle();
        $(".add-new").attr("disabled", "disabled");
        $(this).parents("tr").find(".add").removeClass("add").addClass("update").attr('data-original-title', 'Update');
    });
});~~``