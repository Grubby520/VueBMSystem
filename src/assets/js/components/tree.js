/**
*作者:wanglei
*功能：树形菜单，图标是采用smbol的方式,依赖阿里图标库管理工具生成的symbol图标
*日期:2018/1/19
*/

function Tree(id) {
    if (document.getElementById(id)) {
        this.ele = document.getElementById(id);
    } else {
        throw 'The ID "' + id + '"of a DOM is not exist';
    }
}

/**
*作者:wanglei
*参数:data:
 * var treeData = [
 {
     text: "操作系统服务节点",
     id: 1,
     alias: "别名",
     attributes: {},
     children: [
         {
             text: "二级菜单",
             id: 2,
             alias: "别名",
             attributes: {},
             children: [
                 {
                     text: "三级菜单",
                     id: 3,
                     alias: "别名",
                     attributes: {},
                     children: [
                         {
                             text: "四级菜单",
                             id: 4,
                             alias: "别名",
                             attributes: {}
                         }
                     ]
                 }
             ]
         }
     ]
 }
 ];
*功能:
*日期:2018/1/23
*/
Tree.getTreeHtm = function(tree, data) {
    var treeHtm = "",
        treeNodeIcon = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-folder-closed"></use></svg>'+
        '<svg class="icon" aria-hidden="true" style="display: none"><use xlink:href="#icon-folder-opened"></use></svg>',
        adjustableIcon = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-arrow-right"></use></svg>'+
        '<svg class="icon" aria-hidden="true" style="display: none"><use xlink:href="#icon-arrow-down"></use></svg>',
        treeLeafNodeIcon = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-file"></use></svg>';
    if (tree.config.isOpen) {
        treeNodeIcon = '<svg class="icon" aria-hidden="true" style="display: none"><use xlink:href="#icon-folder-closed"></use></svg>'+
            '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-folder-opened"></use></svg>';
        adjustableIcon = '<svg class="icon" aria-hidden="true" style="display: none"><use xlink:href="#icon-arrow-right"></use></svg>'+
            '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-arrow-down"></use></svg>';
    }

    return '<ul class="waui-tree">' + recursive(data) + "</ul>";

    function recursive(arr) {
        var length = arr.length,
            i = 0,
            tempObj = null,
            initShowClass = tree.config.isOpen?'':'nodisplay',
            str = "";
        while (i <= length - 1) {
            tempObj = arr[i];
            if (!tempObj.leaf) {
                str +=
                    '<li data-open="' +
                    tree.config.isOpen +
                    '" data-id="'+
                    tempObj.id +
                    '" data-param="' +
                    JSON.stringify(tempObj.attributes) +
                    '">' +
                    adjustableIcon +
                    '<a>' +
                    treeNodeIcon +
                    '<span>' +
                    tempObj.text +
                    '</span></a>' +
                    '<ul class="'+initShowClass+'">' +
                    recursive(tempObj.children) +
                    "</ul></li>";
            } else {
                str +=
                    '<li class="leaf" data-id="'+
                    tempObj.id +
                    '" data-param="' +
                    JSON.stringify(tempObj.attributes) +
                    '">' +
                    "<a>" +
                    treeLeafNodeIcon +
                    "<span>" +
                    tempObj.text +
                    "</span></a></li>";
            }
            i++;
        }

        return treeHtm + str;
    }
};

Tree.prototype.config = {
    isOpen: false
};

Tree.prototype.render = function(data) {
    $(this.ele).html(Tree.getTreeHtm(this, data));
};

Tree.prototype.getNodes = function(){
    return $(this.ele).find(".waui-tree li");
}

Tree.prototype.addEventListener = function(type, fn) {
    $(this.ele)
        .find(".waui-tree li")
        .on(type, function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $this = $(this);

            $this.parents(".waui-tree").find("li").removeClass("active");
            $this.addClass("active");

            if ($this.children("ul").length > 0) {
                if ($this.attr("data-open") == "true") {
                    $this.children("ul").slideUp();
                    //箭头图标变化
                    $this.children("svg").first().show().next().hide();
                    //文件夹图标变化
                    $this.children("a").children("svg").first().show().next().hide();

                    $this.attr("data-open", "false");
                } else {
                    $this.children("ul").slideDown();
                    //箭头图标变化
                    $this.children("svg").first().hide().next().show();
                    //文件夹图标变化
                    $this.children("a").children("svg").first().hide().next().show();

                    $this.attr("data-open", "true");
                }
            }

            fn($this);

        });
};

Tree.defaultClickListener = function($this) {};

module.exports = Tree;

