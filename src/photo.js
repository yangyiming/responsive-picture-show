////幻灯片
//var dataSource = [{image:"../images/banner/22.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/22.jpg",text:""},
//    {image:"../images/banner/690x360.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/690x360.jpg",text:"232323"},
//    {image:"../images/banner/919x520-1.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/919x520-1.jpg",text:""},
//    {image:"../images/banner/919x520-1.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/919x520-1.jpg",text:""},
//    {image:"../images/banner/919x520-1.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/919x520-1.jpg",text:""},
//    {image:"../images/banner/690x360.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/690x360.jpg",text:"232323"},
//    {image:"../images/banner/919x520-1.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/919x520-1.jpg",text:""},
//    {image:"../images/banner/919x520-1.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/919x520-1.jpg",text:""},
//    {image:"../images/banner/919x520-1.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/919x520-1.jpg",text:""},
//    {image:"../images/banner/690x360.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/690x360.jpg",text:"232323"},
//    {image:"../images/banner/919x520-1.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/919x520-1.jpg",text:""},
//    {image:"../images/banner/919x520-1.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/919x520-1.jpg",text:""},
//    {image:"../images/banner/919x520-1.jpg",thumbnail:"../images/banner/135x87.jpg",url:"../images/banner/919x520-1.jpg",text:""}
//];
//slidesjs(dataSource);
function slidesjs(data){
    var dataSource = data;
    if(!dataSource){
        alert("请提供有效的数据源");
        return
    }
    var $thumbSlide = $("#thumbSlide");
    var $thumbSlideTab = $("#thumbSlideTab");
    var $thumbSlideText = $("#thumbSlideText");
    var $thumbnailMask = $(".thumbnail-image-mask",$thumbSlideTab);
    var $slidesjsThumbnail = $("ul","#thumbSlideTab");
    var $item;
    var  $thumbSlideBox = $(".thumbSlide-tab-box");
    var maskleft = parseInt($thumbnailMask.css("left"));
    //放大图标
    var $zoomIco = $(".image-zoom-ico",$thumbSlide.parent());
    //左右箭头遮罩
    var $slideMask = $(".slide-arrow",$thumbSlide.parent());

    var $slideThumbBox = $(".slidesjs-thumbnail-box");
    //空的缩略图容器占位符
    var $slideThumbEmpty = $(".slidesjs-thumbnail-box-empty");
    var throttleTimeout;

    var prevBtn = $(".prev",".thumbSlide-tab-box");
    var nextBtn = $(".next",".thumbSlide-tab-box");
    var $navigationPrev = $("#slidesjs-previous");
    var $navigationNext = $("#slidesjs-next");

    var $title = $("#slideModuleTile");

    //当前索引
    var index = 0;

    //滚动的实例对象
    var scrollApi;
    //幻灯片实例对象
    var slideApi;
    var speed = 100;
    var itemWidth = 139;//缩略图的宽度
    var thumbnailWidth; //缩略图容器的宽度
    var oldSelect = 0;//记录上一次的选择

    var showItems;//可显示的数量
    var sum = dataSource.length;//总数量
    var lastIndex = sum - 1;//最后一项
    var middleIndex;//开始状态的中间量索引值
    var maxIndex;//末端中间量索引值
    var index = 0;//index 当前的索引
    var moveNumber;//可移动的数量
    var thumbnailSumWidth = sum * itemWidth;
    var moveDistance;//移动距离
    var halfItem;
    var containerWidth;
    var oldScrollPosition = 0;//滚动之前的滚动数值
    var scrollPosition = 0;//当前的滚动数值
    var Difference;//滚动差值
    setTitleNumber(index);
    calculateSlideHeight();
    setPosition();
    createSlide();
    createThumb();

    scrollPaneInit();
    slideInit();
    eventHandle();
    //根据屏幕大小设置宽度
    function setPosition(){
        var $module = $(".image-show-module");
        var  $listBox = $(".item-image-list",".slidesjs-thumbnail-box");
        var listBoxWidth = $listBox.eq(0).width();
        var arrowWidth = 100;
        containerWidth =$module.width() - (listBoxWidth*2) - 60;
        thumbnailWidth = containerWidth-100;
        $thumbSlideBox.css({
            width:containerWidth,
            marginLeft:-containerWidth/2
        })
        $thumbSlideTab.css({
            width:thumbnailWidth
        })
        caculateShowItem();
    }
    function calculateSlideHeight(){
        var windowH = $(window).height();
//        var $listBox = $(".item-image-list",".slidesjs-thumbnail-box");
//        var textHeight = $thumbSlideText.outerHeight();
//        var listHeight = $listBox.outerHeight()+30;
        var textHeight = 67;
        var listHeight = 144;
        var surplusHeight = windowH - (156 + textHeight + listHeight);
        $thumbSlide.height(surplusHeight);
        refreshSlide(surplusHeight);
        $slideMask.height(surplusHeight);
        removeThumbEmpty();
    }
    function refreshSlide(surplusHeight){
        if(slideApi){
            slideApi.options.height = surplusHeight;
            slideApi.update();
        }
    }
    //删除缩略图占位符
    function removeThumbEmpty(){
        $slideThumbBox.removeClass("fixed");
        $slideThumbEmpty.remove();
        $thumbSlideText.removeClass("fixed");
    }


    //判断开端和末端移动的边界
    function judgeIndex(index) {
        var remainItem = 0;
        var top;
        var bottom;
        var isTop = false;
        var isBottom = false;
        if (showItems % 2 == 0) {
            if (index <= oldSelect) {
                top = oldSelect - middleIndex;
            } else {
                bottom = oldSelect + middleIndex;
            }
        }else {
            remainItem = (showItems - 1) / 2;
            if (index <= oldSelect) {
                top = oldSelect - middleIndex;
                if(oldSelect == maxIndex){
                    top = oldSelect - (middleIndex+1);
                }
            } else {
                top = middleIndex;
                bottom = (oldSelect + remainItem) + 1;
            }
        }
        if (top <= 0) {
            isTop = true;
        }
        if (bottom >= lastIndex) {
            isBottom = true;
        }

        return {
            isTop: isTop,
            isBottom: isBottom,
            top: top,
            bottom: lastIndex - bottom
        }
    }

    // 末端中间量索引值
    function getMaxMiddleIndex() {
        var items;
        if (showItems % 2 == 0) {
            items = showItems / 2;
        }else {
            items = (showItems-1) / 2;
        }
        maxIndex = lastIndex - items;
    }

    //過濾索引值
    function filterIndex(number) {
        if (number < 0) {
            index = 0;
        }
        if (number > lastIndex) {
            index = lastIndex;
        }
    }

    //获取剩余的宽度
    function getHalfItem(){
        if(showItems * itemWidth < containerWidth){
            halfItem =  containerWidth - showItems * itemWidth-4;
        }else {
            halfItem = 0;
        }
    }
    /*
     * 可显示数量: showItems
     * 开始中间值: middleIndex
     * 末端中间值:maxIndex
     * */
    function caculateShowItem() {
        //可移动图片的数量
        showItems =  Math.floor(thumbnailWidth / itemWidth);
        middleIndex = Math.floor(showItems / 2);
        if(middleIndex == 0){
            middleIndex = 1;
        }
        getMaxMiddleIndex();
        getHalfItem();
//            console.log("可显示数量" + showItems);
//            console.log("开始中间值" + middleIndex);
//            console.log("末端中间值" + maxIndex);
    }
    //图集的文本
    function setText(index){
        var current = index+1;
        var allLength = dataSource.length;
        var $textBox = $thumbSlideText.find(".image-title");
        var $current = $thumbSlideText.find(".current");
        var $all = $thumbSlideText.find(".all");
        var $slash = $thumbSlideText.find(".slash");
        judgeTextEmpty(index);
        $current.text(current);
        $all.text(allLength);
        $slash.text("/");
        $textBox.text(dataSource[index].text);
    }
    //设置图集title页码的显示
    function setTitleNumber(index){
        var current = index+1;
        var allLength = dataSource.length;
        var $current = $title.find(".current");
        var $all = $title.find(".all");
        var $slash = $title.find(".slash");
        $current.text(current);
        $all.text(allLength);
        $slash.text("/");
    }
    function judgeTextEmpty(index){
        if(dataSource[index].text == ""){
            $thumbSlideText.addClass("empty")
        }else {
            $thumbSlideText.removeClass("empty")
        }
    }
    //构造幻灯片图片
    function createSlide(){
        $.each(dataSource,function(index,item){
            var banner = $("<div></div>",{
                "class":"banner bigLoading"
            }).appendTo($thumbSlide);
            var bannerLink = $("<div class='box' style='position: relative'></div>",{
                "href":item.url
            }).appendTo(banner);
        })
    }
    //构造缩略图
    function createThumb(){
        var ul = $("<ul></ul>").appendTo($thumbSlideTab);
        $.each(dataSource,function(index,item){
            var li = $("<li></li>",{
                "class":"slidesjs-thumbnail-item smallLoading"
            }).appendTo(ul);
            loadThumalImage(index);
        });
        $(ul).width(thumbnailSumWidth);
        $item = $(".slidesjs-thumbnail-item",$thumbSlideTab);
    }
    //图片预加载
    function loadImage(index){
        var $imgDom = $("<img />");
        var $banner = $(".banner",$thumbSlide);
        var $bannerLink = $banner.find(".box");
        $imgDom.bind("load", function() {
            var imageWidth = $imgDom[0].width;
            var imageHeight = $imgDom[0].height;
            $imgDom.hide();
            setText(index);
            setTitleNumber(index);
            calculateSlideHeight();
            $imgDom.data("width",imageWidth);
            $imgDom.data("height",imageHeight);
            var parentWidth = $thumbSlide.width();
            var  parentHeight = $thumbSlide.height();
            var imageData = resize_image($imgDom,imageWidth,imageHeight,parentWidth,parentHeight);
            createZoomBox(imageData,index);
            setZoomIco(index);
            $bannerLink.eq(index).append($imgDom);
            $banner.eq(index).removeClass("bigLoading");
            $imgDom.fadeIn();
            $banner.eq(index).data("loaded",true);
            thumbnailGroupMove(index);
        }).bind("error",function(){
                $bannerLink.eq(index).html("图片错误");
                setText(index);
                setTitleNumber(index);
                $banner.data("loaded",true);
            }).attr("src", dataSource[index].image);
    }
    //图片缩放在容器范围内 按照小的比例进行缩放
    function resize_image(self,image_width,image_height,parent_width,parent_height) {
        var  image = self;
        var imageWidth,imageHeight,marginT,marginL;
        if( image_width <= parent_width  && image_height <= parent_height){
            imageWidth = image_width;
            imageHeight = image_height;
            var marginT = Math.ceil(parent_height/2 - imageHeight/2);
            var marginL = Math.ceil(parent_width/2 - imageWidth/2);
            image.css({
                'width' : imageWidth+"px",
                'height': imageHeight+"px"
            })
            return {
                width:imageWidth,
                height:imageHeight,
                'marginTop':marginT,
                'marginLeft':marginL
            }
        }
        if (parent_width / image_width > parent_height / image_height) {
            imageHeight = parent_height;
            imageWidth = image_width*parent_height / image_height;
            marginT = Math.ceil(parent_height/2 - imageHeight/2);
            marginL = Math.ceil(parent_width/2 - imageWidth/2);
        }
        else {
            imageWidth = parent_width;
            imageHeight = image_height*parent_width / image_width;
            marginT =  Math.ceil(parent_height/2 - imageHeight/2);
            marginL =  Math.ceil(-(parent_width/2 - imageWidth/2));
        }
        image.css({
            'width' : imageWidth+"px",
            'height': imageHeight+"px"
        })
        return {
            width:imageWidth,
            height:imageHeight,
            'marginTop':marginT,
            'marginLeft':marginL
        }
    }
    //缩略图按比例缩放 按照大的比例进行缩放
    function resizeThumail(self, image_width, image_height, parent_width, parent_height) {
        var image = self;
        var imageWidth, imageHeight, marginT, marginL;
        if (image_width <= parent_width && image_height <= parent_height) {
            imageWidth = image_width;
            imageHeight = image_height;
            var marginT = Math.ceil(parent_height / 2 - imageHeight / 2);
            var marginL = Math.ceil(parent_width / 2 - imageWidth / 2);
        }
        if (parent_width / image_width > parent_height / image_height) {
            imageHeight = image_height * parent_width / image_width;
            imageWidth = image_width * parent_width / image_width;
            var marginT = Math.ceil(parent_height / 2 - imageHeight / 2);
            var marginL = Math.ceil(-(parent_width / 2 - imageWidth / 2));
        }
        else {
            imageWidth = image_width * parent_height / image_height;
            imageHeight = image_height * parent_height / image_height;
            marginT = Math.ceil(parent_height / 2 - imageHeight / 2);
            marginL = Math.ceil(parent_width / 2 - imageWidth / 2);
        }
        image.css({
            'width': imageWidth + "px",
            'height': imageHeight + "px",
            'marginLeft': marginL + "px"
        })
        return {
            width: imageWidth,
            height: imageHeight
        }
    }
    //图片预加载
    function loadThumalImage(index){
        var $imgDom = $("<img />");
        var $banner = $(".slidesjs-thumbnail-item",$thumbSlideTab);
        $imgDom.bind("load", function () {
            var imageWidth = $imgDom[0].width;
            var imageHeight = $imgDom[0].height;
            $imgDom.hide();
            $imgDom.data("width", imageWidth);
            $imgDom.data("height", imageHeight);
            var parentWidth = $banner.eq(0).width();
            var parentHeight = $banner.eq(0).height();
            resizeThumail($imgDom, imageWidth, imageHeight, parentWidth, parentHeight);
            $banner.eq(index).append($imgDom);
            $banner.eq(index).removeClass("smallLoading");
            $imgDom.fadeIn();
            $banner.eq(index).data("loaded", true);
        }).bind("error", function () {
            $banner.eq(index).html("图片错误");
            setText(index);
            setTitleNumber(index);
            $banner.data("loaded", true);
        }).attr("src", dataSource[index].thumbnail);//.image);
        }
    //图片容器构造
    function createZoomBox(data,index){
        var $banner = $(".banner",$thumbSlide);
        var $bannerBox= $banner.find(".box");
        $bannerBox.eq(index).css({
            'width' : data.width+"px",
            'height': data.height+"px",
            'marginTop':data.marginTop+"px",
            'marginLeft':data.marginLeft+"px"
        })
    }
    //放大图标
    function setZoomIco(index){
        var icoWidth = $zoomIco.width();
        var $banner = $(".banner",$thumbSlide).eq(index);
        var $box = $banner.find(".box");
        var left = parseInt($box.css("marginLeft"));
        var top = parseInt($box.css("marginTop"));
        var boxWidth = $box.width();
        var imageUrl =  dataSource[index].url;
        $zoomIco.attr("href",imageUrl);
        $zoomIco.css({
            display:"block",
            position:"absolute",
            zIndex:15,
            left:boxWidth + left - icoWidth,
            top: top
        })
    }
    //幻灯片插件初始化
    function slideInit(){
        var w = $thumbSlide.width();
        var h = $thumbSlide.height();
        //幻灯片对象
        $thumbSlide.slidesjs({
            width:w,
            height:h,
            tabMask: {
                active:true,
                direction: "left",
                element:$thumbnailMask
            },
            thumbnail:{
                active:true,
                element:$thumbSlideTab
            },
            navigation: {
                active: false
            },
            pagination: {
                active: false
            },
            effect: {
                slide: {
                    speed: 300
                },
                fade: {
                    speed: 300,
                    crossfade: true
                }
            },
            play: {
                active: false,
                effect: "slide",
                interval: 3000,
                auto: false,
                swap: true,
                pauseOnHover: false,
                restartDelay: 2500
            },
            callback:{
                loaded:function(){
                    index = 0;
                    loadImage(index);
                },
                start:function(){
                    //隐藏放大图标
                    $zoomIco.hide();
                },
                complete:function(){
                    var thumbSlideItem = $(".banner",$thumbSlide);
                    if(slideApi){
                        index = slideApi.data.current;
                    }else {
                        //幻灯片实例对象
                        slideApi =  $thumbSlide.data("plugin_slidesjs");
                    }
                    if(!thumbSlideItem.eq(index).data("loaded")){
                        loadImage(index);
                    }else {
                        setText(index);
                        setTitleNumber(index);
                        calculateSlideHeight();
                        initImage(index);
                        thumbnailGroupMove(index);
                    }
                    isShowNextImageList(index);
                }
            }
        });
        //幻灯片实例对象
        slideApi =  $thumbSlide.data("plugin_slidesjs");
    }
    //滚动条初始化
    function scrollPaneInit(){
        $thumbSlideTab.jScrollPane({
            showArrows:true,
            autoReinitialise: true
        })
        //滚动的实例对象
        scrollApi = $thumbSlideTab.data('jsp');
    }

   function getOldScrollPosition(){
       oldScrollPosition = scrollApi.getContentPositionX();
       eventHandle();
   }
    //事件绑定
    function eventHandle(){
        nextBtn.off().on("click",nextGroupMethod);
        prevBtn.off().on("click",prevGroupMethod);
        $navigationNext.off().on("click",nextMethod);
        $navigationPrev.off().on("click",prevMethod);
        $(window).unbind("resize.scollSlide").bind("resize.scollSlide",function(){
            var normalItem = showItems;
            if (oldSelect == 0) {
                oldSelect = middleIndex;
            }
            var old = oldSelect;
            calculateSlideHeight();
            setPosition();
            initImage(index);
            if(showItems - normalItem > 0){
                oldSelect = old + Math.floor((showItems - normalItem)/2);
            }else {
                oldSelect = old - Math.floor((normalItem - showItems)/2);
            }
        })
    }
    //图片大小初始化
    function initImage(index){
        var $banner = $(".banner",$thumbSlide);
        var $image = $banner.eq(index).find("img");
        var image_width = $image.data("width");
        var image_height = $image.data("height");
        var  parent_width =$thumbSlide.width();
        var  parent_height =$thumbSlide.height();
        var imageData = resize_image($image,image_width,image_height,parent_width,parent_height);
        createZoomBox(imageData,index);
        setZoomIco(index);
    }
//    var prevBtn = $(".prev",".thumbSlide-tab-box");
//    var nextBtn = $(".next",".thumbSlide-tab-box");
//    var $navigationPrev = $("#slidesjs-previous");
//    var $navigationNext = $("#slidesjs-next");
    //切换下一张图
    function nextMethod(e){

        e.stopPropagation();
        $navigationNext.unbind("click");
        index++;
        if(index > lastIndex){
            return
        }
        slideApi.goto(index+1);
    }
    //切换上一张图
    function prevMethod(e){
        e.preventDefault();
        e.stopPropagation();
        $navigationPrev.unbind("click");
        index = slideApi.data.current+1;
        index--;
        slideApi.goto(index);
    }
    //切换下一组图
    function nextGroupMethod(e){
        e.preventDefault();
        e.stopPropagation();
        nextBtn.unbind("click");
        moveNumber = middleIndex;
        var scrollDistance = moveNumber * itemWidth;
        scrollApi.scrollByX(scrollDistance,speed,function(){
            eventHandle();
        });
    }
    //切换上一组图
    function prevGroupMethod(e){
        e.preventDefault();
        e.stopPropagation();
        var scrollDistance = 0;
        prevBtn.unbind("click");
        moveNumber = middleIndex;
        var scrollDistance = moveNumber * itemWidth;
        scrollApi.scrollByX(-scrollDistance,speed,function(){
            eventHandle();
        });
    }
    //缩略图移动
    function thumbnailGroupMove(index) {
        var number = parseInt(index);
        var scrollDistance = 0;
        if (oldSelect == 0) {
            oldSelect = middleIndex;
        }
        var judge = judgeIndex(number);
        if (number >= oldSelect) {
            if (!judge.isBottom) {
                moveNumber = number - oldSelect;
                oldSelect = number;
                if (judge.bottom < moveNumber) {
                    oldSelect = maxIndex;
                    moveNumber = judge.bottom;
                }
                scrollDistance = moveNumber * itemWidth;
            } else {
                oldSelect = maxIndex;
                scrollDistance = halfItem;
            }
            scrollPosition =  scrollApi.getContentPositionX();
            if(Math.abs(scrollPosition - oldScrollPosition) > 0){
                Difference = scrollPosition - oldScrollPosition;
                if(number == lastIndex){
                    scrollApi.scrollByX(scrollDistance - Difference+halfItem,speed,getOldScrollPosition);
                }else{
                    scrollApi.scrollByX(scrollDistance - Difference,speed,getOldScrollPosition);
                }
            }else {
                scrollApi.scrollByX(scrollDistance,speed,getOldScrollPosition);
            }
        } else {
            if (!judge.isTop) {
                moveNumber = oldSelect - number;
                oldSelect = number;
                if (judge.top < moveNumber) {
                    oldSelect = middleIndex;
                    moveNumber = judge.top;
                }
                scrollDistance = moveNumber * itemWidth;
            }else {
                oldSelect = middleIndex;
                scrollDistance = halfItem;
            }
            scrollPosition =  scrollApi.getContentPositionX();
            if(Math.abs(scrollPosition - oldScrollPosition) > 0){
                Difference = scrollPosition - oldScrollPosition;
                if(number == 0){
                    scrollApi.scrollToX(0,speed,getOldScrollPosition);
                }else{
                    scrollApi.scrollByX(-(scrollDistance + Difference),speed,getOldScrollPosition);
                }
            } else {
                scrollApi.scrollByX(-scrollDistance,speed,getOldScrollPosition);
            }
        }
    }
    //判断是否是最后一张图 如果是最后一张图片则显示下一个图集
    function isShowNextImageList(){
        //当前点击的对象处于图片集的最后一张
        if(index+1 == slideApi.data.total){
            $navigationNext.addClass("next-list");
            $($navigationNext).attr("href", $("#NextAlbums").attr("href"));
        }else {
            $navigationNext.removeClass("next-list");
            $($navigationNext).attr("href","javascript:void(0)");
        }
    }
}