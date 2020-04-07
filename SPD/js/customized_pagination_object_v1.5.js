
class CPagination {
    constructor(target, totalPageCount = 1, showPageCount = 1, currentPageNo = 1, callback) {
        if (!target) {
            throw new Error("Target are required.");
        }

        if (!$(target).length) {
            throw new Error("Target is invalid.");
        }

        this.target = target;
        this.totalPageCount = totalPageCount;
        this.showPageCount = showPageCount;
        this.currentPageNo = currentPageNo;
        this.callback = callback;
    }

    start() {
        $(this.target).empty();
        let thisObj = this;

        let nav = $("<nav>").attr("aria-label", "Page navigation");
        let unorderedList = $("<ul>").attr("class", "pagination pagination-circle pg-blue").appendTo(nav);

        let firstPageLiTag = $("<li>").attr("class", `page-item left_item ${(this.currentPageNo === 1) ? "disabled" : ""}`).appendTo(unorderedList);
        let firstPageLink = $("<a>").append("First").attr("class", "page-link").appendTo(firstPageLiTag);

        let previousPageLiTag = $("<li>").attr("class", `page-item left_item ${(this.currentPageNo === 1) ? "disabled" : ""}`).appendTo(unorderedList);
        let previousPageLink = $("<a>")
            .append('<span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span>')
            .attr({
                "class": "page-link",
                "aria-label": "Previous"
            }).appendTo(previousPageLiTag);

        let [firstPage, lastPage] = this.findFirstAndLastPage(this.totalPageCount, this.showPageCount, this.currentPageNo);

        let callback = this.callback;

        for (let i = firstPage; i <= lastPage; i++) {
            let pageLiTag = $("<li>").attr("class", `page-item ${(i === this.currentPageNo) ? "active" : ""}`).appendTo(unorderedList);
            let pageLink = $("<a>").append(i).attr("class", "page-link custom_page_link").appendTo(pageLiTag);

            (function ($, i) {
                pageLink.on("click", function (e) {
                    e.preventDefault();

                    if (!$(this).parent().hasClass("active")) {
                        callback(parseInt($(this).text()));

                        let options = {
                            totalPageCount: thisObj.totalPageCount,
                            showPageCount: thisObj.showPageCount,
                            currentPageNo: parseInt($(this).text())
                        };
                        thisObj.traverse(options);
                    }
                });
            })(jQuery, i);
        }

        let nextPageLiTag = $("<li>").attr("class", `page-item right_item ${(this.currentPageNo === this.totalPageCount) ? "disabled" : ""}`).appendTo(unorderedList);
        let nextPageLink = $("<a>")
            .append('<span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span>')
            .attr({
                "class": "page-link",
                "aria-label": "Next"
            }).appendTo(nextPageLiTag);

        let lastPageLiTag = $("<li>").attr("class", `page-item right_item ${(this.currentPageNo === this.totalPageCount) ? "disabled" : ""}`).appendTo(unorderedList);
        let lastPageLink = $("<a>").append("Last").attr("class", "page-link").appendTo(lastPageLiTag);

        (function ($) {
            firstPageLink.on("click", function (e) {
                e.preventDefault();
                if (!firstPageLiTag.hasClass("disabled")) {
                    callback(1);

                    let options = {
                        totalPageCount: thisObj.totalPageCount,
                        showPageCount: thisObj.showPageCount,
                        currentPageNo: 1
                    };
                    thisObj.traverse(options);
                }
            });

            previousPageLink.on("click", function (e) {
                e.preventDefault();
                if (!previousPageLiTag.hasClass("disabled")) {
                    let destinationPage = parseInt($(thisObj.target).find(".page-item.active > a").text()) - 1;
                    callback(destinationPage);

                    let options = {
                        totalPageCount: thisObj.totalPageCount,
                        showPageCount: thisObj.showPageCount,
                        currentPageNo: destinationPage
                    };
                    thisObj.traverse(options);
                }
            });

            nextPageLink.on("click", function (e) {
                e.preventDefault();
                if (!nextPageLiTag.hasClass("disabled")) {
                    let destinationPage = parseInt($(thisObj.target).find(".page-item.active > a").text()) + 1;
                    callback(destinationPage);

                    let options = {
                        totalPageCount: thisObj.totalPageCount,
                        showPageCount: thisObj.showPageCount,
                        currentPageNo: destinationPage
                    };
                    thisObj.traverse(options);
                }
            });

            lastPageLink.on("click", function (e) {
                e.preventDefault();
                if (!lastPageLiTag.hasClass("disabled")) {
                    callback(thisObj.totalPageCount);

                    let options = {
                        totalPageCount: thisObj.totalPageCount,
                        showPageCount: thisObj.showPageCount,
                        currentPageNo: thisObj.totalPageCount
                    };
                    thisObj.traverse(options);
                }
            });

        })(jQuery);

        nav.appendTo($(this.target));
    }

    findFirstAndLastPage(totalPageCount, showPageCount, currentPageNo) {
        let firstPage = currentPageNo - Math.floor(showPageCount / 2);
        firstPage = firstPage <= 0 ? firstPage = 1 : firstPage;

        let lastPage = firstPage + showPageCount - 1;
        if (lastPage > totalPageCount) {
            lastPage = totalPageCount
        }

        if ((lastPage - firstPage + 1) < showPageCount && (totalPageCount - showPageCount + 1) > 0) {
            firstPage = totalPageCount - showPageCount + 1;
        }

        return [firstPage, lastPage];
    }

    traverse(options) {
        let pageLinks = $(this.target).find(".custom_page_link").toArray();
        let [firstPage, lastPage] = this.findFirstAndLastPage(options.totalPageCount, options.showPageCount, options.currentPageNo);

        for (let i = firstPage, j = 0; i <= lastPage; i++ , j++) {
            (i === options.currentPageNo) ? $(pageLinks[j]).parent().addClass("active") : $(pageLinks[j]).parent().removeClass("active");

            $(pageLinks[j]).text(i);
        }

        (options.currentPageNo === 1) ? $(this.target).find(".left_item").addClass("disabled")
            : $(this.target).find(".left_item").removeClass("disabled");

        (options.currentPageNo === options.totalPageCount) ? $(this.target).find(".right_item").addClass("disabled")
            : $(this.target).find(".right_item").removeClass("disabled");
    }
};

