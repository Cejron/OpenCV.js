//输入一个图像和两个参数，返回一个
function face(inimg, outimg, value1, value2) {

    if (value1 == null || value1 == undefined) value1 = 3;//磨皮系数
    if (value2 == null || value2 == undefined) value2 = 1;//细节系数 0.5 - 2

    var dx = value1 * 5;//双边滤波参数
    var fc = value1 * 12.5;//参数
    var p = 0.1;//透明度

    let temp1 = new cv.Mat(), temp2 = new cv.Mat(), temp3 = new cv.Mat(), temp4 = new cv.Mat();

    cv.cvtColor(inimg, inimg, cv.COLOR_RGBA2RGB, 0);

    cv.bilateralFilter(inimg, temp1, dx, fc, fc);

    let temp22 = new cv.Mat();
    cv.subtract(temp1, inimg, temp22);

    cv.add(temp22, new cv.Mat(inimg.rows, inimg.cols, inimg.type(), new cv.Scalar(128, 128, 128, 128)), temp2);//bilateralFilter(Src) - Src + 128

    cv.GaussianBlur(temp2, temp3, new cv.Size(2 * value2 - 1, 2 * value2 - 1), 0, 0);

    let temp44 = new cv.Mat();
    temp3.convertTo(temp44, temp3.type(), 2, -255);
    //2 * GuassBlur(bilateralFilter(Src) - Src + 128) - 256

    cv.add(inimg, temp44, temp4);
    cv.addWeighted(inimg, p, temp4, 1 - p, 0.0, outimg);
    //Src * (100 - Opacity)

    cv.add(outimg, new cv.Mat(inimg.rows, inimg.cols, inimg.type(), new cv.Scalar(10, 10, 10, 0)), outimg);
    //(Src * (100 - Opacity) + (Src + 2 * GuassBlur(bilateralFilter(Src) - Src + 128) - 256) * Opacity) /100
    return outimg;
}
//输入两个图像,返回后一个图像作为输出的图像, 处理->对比度，亮度
function thresholding(inimg, outimg) {
    if (outimg != null) {
        cv.threshold(outimg, outimg, 120, 255, cv.THRESH_BINARY);
    } else {
        cv.threshold(inimg, outimg, 120, 255, cv.THRESH_BINARY);
    }
    return outimg;
}
//双滤波模糊
function doubleBilateral(inimg, outimg) {
    if (outimg != null) {
        cv.cvtColor(outimg, outimg, cv.COLOR_RGBA2RGB, 0);
        cv.bilateralFilter(outimg, outimg, 9, 75, 75, cv.BORDER_DEFAULT);
    }else{
        cv.cvtColor(inimg, outimg, cv.COLOR_RGBA2RGB, 0);
        cv.bilateralFilter(inimg, outimg, 9, 75, 75, cv.BORDER_DEFAULT);
    }
    return outimg;
}
//image过滤
function imagefiter(inimg, outimg){
    if (outimg != null) {
        let M = cv.Mat.eye(3, 3, cv.CV_32FC1);
        let anchor = new cv.Point(-1, -1);
        cv.filter2D(outimg, outimg, cv.CV_8U, M, anchor, 0, cv.BORDER_DEFAULT);
    } else {
        let M = cv.Mat.eye(3,3, cv.CV_32FC1);
        let anchor = new cv.Point(-1,-1);
        cv.filter2D(inimg, outimg, cv.CV_8U, M, anchor, 0, cv.BORDER_DEFAULT);
    }
    return outimg;
}
//转颜色
function convertCol(inimg, outimg) {
    if (outimg != null) {
        cv.cvtColor(outimg, outimg, cv.COLOR_RGBA2GRAY, 0);
    } else {
        cv.cvtColor(inimg, outimg, cv.COLOR_RGBA2GRAY, 0);
    }
    return outimg;
}
//真*黑白
function imageInrange(inimg, outimg) {
    if (outimg != null) {
        //150,150,150,255
        let low = new cv.Mat(outimg.rows, outimg.cols, outimg.type(), [0, 0, 0, 0]);
        let high = new cv.Mat(outimg.rows, outimg.cols, outimg.type(), [150, 150, 150, 255]);
        cv.inRange(outimg, low, high, outimg);
    } else {
        //150,150,150,255
        let low = new cv.Mat(inimg.rows, inimg.cols, inimg.type(), [0, 0, 0, 0]);
        let high = new cv.Mat(inimg.rows, inimg.cols, inimg.type(), [150, 150, 120, 255]);
        cv.inRange(inimg, low, high, outimg);
    }
    return outimg;
}

//输出图片
function outputImage(id, fileName) {
    //拿到处理好的canvas元素
    var canvasElement = document.getElementById(id);
    var MIME_TYPE = "image/png";

    //创建一个可得到canvas元素中图片的链接(带图片类型)
    var imgURL = canvasElement.toDataURL(MIME_TYPE);

    var dlLink = document.createElement('a');
    dlLink.download = fileName;
    dlLink.href = imgURL;
    //链接下载地址数据设置  图片类型/文件名/下载链接
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
    console.log(dlLink);
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}