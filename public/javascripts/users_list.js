var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $TBODY = $('#datatable-fixed-header'),
    $ADD_USER_SUBMIT = $('#add_user_submit'),
    $EDIT_PASS_SUBMIT = $('#edit_pass_submit'),
    $EDIT_USERINFO_SUBMIT = $('#edit_userInfo_submit'),
    $DEL_USERTOKEN_SUBMIT = $('#del_userToken_submit'),
    $NEW_NAME = $('#new_username'),
    USER_NAME = '',
    NICKNAME = '',
    GROUP_DATA = '';
$(document).ready(function() {
    var $Table = $TBODY.DataTable({
        serverSide: true,
        bAutoWidth: false,
        bLengthChange: false,
        bFilter: false,
        ordering: false,
        pageLength: 25,
        fixedHeader: {
            header: true,
            footer: false
        },
        ajax: function (data, callback, settings) {
            //封装请求参数
            var page = $TBODY.DataTable().page.info();
            var param = {};
            param.chatType = 'chat',
                param.countLimit = '25',
                param.page = page.page + 1
            $.ajax({
                type: "GET",
                url: "/user_list",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    console.log(result)
                    setTimeout(function () {
                        var returnData = {};
                        returnData.draw = data.draw;
                        // returnData.recordsTotal = result.data.DBValue.totalCount;
                        // returnData.recordsFiltered = result.data.DBValue.totalCount;
                        returnData.data = result.data.DBValue;
                        callback(returnData);
                    }, 200);
                }
            });
        },
        columns: [
            {data: 'username'},
            {data: 'nickname'},
            {data: 'create_at'},
            {data: ''}
        ],
        columnDefs: [
            {
                "targets": 0,
                "render": function (data, type, row ) {
                    return data
                }
            },
            {
                "targets": -1,
                "data": null,
                "render": function (data, type, row ) {
                    let html = "";
                    // 被刪除帳號不顯示功能項目
                    // if(row.user_status == 1) {
                    //     return html;
                    // }
                    html = "<button type='button' class='btn btn-info btn-edit-user-info btn-get-username' data-toggle='modal' data-target='.user-info-modal-sm'>詳細資料</button>"
                    // html = "<button type='button' class='btn btn-info btn-edit-pass btn-get-username' data-toggle='modal' data-target='.edit-pass-modal-sm'>修改密碼</button>"
                    // + "<button type='button' class='btn btn-info btn-edit-user-info btn-get-username' data-toggle='modal' data-target='.user-info-modal-sm'>詳細資料</button>"
                    // + "<button type='button' class='btn btn-danger btn-del-user-token btn-get-username' data-toggle='modal' data-target='.del-token-modal-sm'>永久停用</button>";
                    return html;
                    
                }
            }
        ]
    });
    // 取得用戶帳號 Modal
    $TBODY.on('click', 'button.btn-get-username', function () {
        USER_NAME = $Table.row( $(this).parents('tr') ).data()['username'];
        NICKNAME = $Table.row( $(this).parents('tr') ).data()['nickname'];
    } );
    // 塞入帳號 + 暱稱至「停用帳號」的彈跳視窗
    // $TBODY.on('click', 'button.btn-del-user-token', function () {
    //     $('#del_user_account').text("帳號: " + USER_NAME);
    //     $('#del_user_nickname').text("暱稱: " + NICKNAME);
    // } );
    //
    // $TBODY.on('click', 'button.btn-edit-pass', function () {
    //     $('#edit_user_account').val(USER_NAME);
    // } );
    // 修改密碼 Submit
    // $($EDIT_PASS_SUBMIT).on('click', function() {
    //     var $edit_pass = $(this).parents('div.modal-content').find('div.modal-body input#edit_pass_input');
    //     $.ajax({
    //         type: "post",
    //         //使用JSONP務必在結尾使用 GET 的 callback=?
    //         url: '/edit_user_pass',
    //         dataType: "json",
    //         data: {
    //             name: USER_NAME,
    //             pass: $edit_pass.val()
    //         },
    //         success: function (data){
    //             // console.log(data);
    //             if (data.status === 'N') {
    //                 show_pnotify("會員修改密碼", data.message, "error");
    //             }
    //             if(data.status == 'Y') {
    //                 show_pnotify('修改密碼', data.message, 'success');
    //                 $Table.ajax.reload();
    //                 $('.edit-pass-modal-sm').modal('hide');
    //                 $edit_pass.val('');
    //             }
    //         },
    //         error: function (data) {
    //             show_pnotify("會員修改密碼", "Ajax連線錯誤", "error");
    //             // console.log(data);
    //         }
    //     })
    // });
    // 顯示會員詳細資料 Modal
    $TBODY.on('click', 'button.btn-edit-user-info', function () {
        $('#username').val(USER_NAME);
        $('#edit_user_nickname').val(NICKNAME);
    } );

    // 編輯會員詳細資料 Modal
    $($EDIT_USERINFO_SUBMIT).on('click', function() {
        let $edit_user_nickname = $('#edit_user_nickname').val();
        $.ajax({
            type: 'POST',
            url: "/edit_user_info",
            dataType: "json",
            data: {
                username: USER_NAME,
                nickname: $edit_user_nickname,
            },
            success: function (data){
                if(data.status == 'Y') {
                    show_pnotify('編輯會員詳細資料', data.message, 'success');
                    $Table.ajax.reload();
                    $('.user-info-modal-sm').modal('hide');
                }else{
                    show_pnotify('編輯會員詳細資料', data.message, 'error');
                    $Table.ajax.reload();
                }
            },
            error: function (err) {
                show_pnotify("編輯會員詳細資料", "建立連線失敗", "error");
            }
        });
    });
    // 當動態視窗隱藏後，觸發該事件
    $('.edit-pass-modal-sm,.user-info-modal-sm,.add-user-modal-sm').on('hidden.bs.modal', function(e) {
        $(this).find('input').val('');
    });
    // 新增用戶 Submit
    $($ADD_USER_SUBMIT).on('click', function() {
        var $username = $('#add_user_form input[name=username]').val(),
            $password = $('#add_user_form input[name=password]').val(),
            $nickname = $('#add_user_form input[name=nickname]').val();

        $.ajax({
            type: "POST",
            url: '/register_member',
            dataType: "json",
            data: {
                username: $username,
                password: $password,
                nickname: $nickname,
            },
            success: function (data){
                if(data.status == 'Y') {
                    $Table.ajax.reload();
                    $('.add-user-modal-sm').modal('hide');
                    $('#add_user_form')[0].reset();
                    show_pnotify('新增會員帳號', data.message, 'success');
                }else{
                    show_pnotify('檢查新會員帳號', data.message, 'error');
                }
            },
            error: function (data) {
                show_pnotify('檢查新會員帳號', data.message, 'error');
            }
        })
    });
    //　刪除用戶Token
    // $($DEL_USERTOKEN_SUBMIT).on('click', function() {
    //     // console.log(USER_NAME);
    //     $.ajax({
    //         type: "POST",
    //         url: '/del_account',
    //         dataType: "json",
    //         data: {
    //             username: USER_NAME
    //         },
    //         success: function (data){
    //             if(data.status == 'N') {
    //                 show_pnotify('刪除Token', data.message, 'error');
    //                 $Table.ajax.reload();
    //             }
    //             if(data.status == 'Y') {
    //                 show_pnotify('刪除Token', data.message, 'success');
    //                 $Table.ajax.reload();
    //                 $('.del-token-modal-sm').modal('hide');
    //             }
    //         },
    //         error: function (data) {
    //             show_pnotify("刪除會員Token", "建立連線失敗", "error");
    //         }
    //     })
    // });
    // 檢查帳號是否已被註冊
    $($NEW_NAME).on('blur', function() {
        let username = $($NEW_NAME).val();
        $.ajax({
            type: "GET",
            //使用JSONP務必在結尾使用 GET 的 callback=?
            url: '/check_New_Member',
            dataType: "json",
            data: {
                username: username,
            },
            success: function (data){
                if(data.status == 'Y') {
                    show_pnotify('檢查新會員帳號', data.message, 'success');
                }
                else{
                    show_pnotify('檢查新會員帳號', data.message, 'error');
                }
            },
            error: function (data) {
                show_pnotify("檢查新會員帳號", "建立連線失敗", "error");
            }
        });
    });
    // 提示訊息
    // title : 標題
    // text : 訊息內容
    // type : 訊息框樣式(success, info, notice, error, dark)
    function show_pnotify(title, text, type) {
        new PNotify({
            title: title,
            text: text,
            type: type,
            styling: 'bootstrap3'
        });
    }

    // $.ajax({
    //     type: "GET",
    //     //使用JSONP務必在結尾使用 GET 的 callback=?
    //     url: '/users/list',
    //     dataType: "json",
    //     data: {
    //         message: 'Helow World'
    //     },
    //     success: function (data){
    //         var result = data;
    //         var html = "<tbody>";
    //         for (idx in result) {
    //             html+="<tr><td>" + result[idx].username + "</td><td>" + result[idx].iterationcount + "</td><td>" + result[idx].created_at+ "</td></tr>";
    //             console.log(result[idx].username);
    //             console.log(result[idx].iterationcount);
    //             console.log(result[idx].created_at);
    //         }
    //         html+="</tbody>";
    //         $TBODY.append(html);
    //         $TBODY.DataTable();
    //         // console.log(data);
    //         // console.log($TBODY);
    //     },
    //     error: function (data) {
    //         console.log(data)
    //     }
    // })
});
