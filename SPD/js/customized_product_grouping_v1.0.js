
class ProductGroup {
    constructor(target, data, itemsPerSlide = 6, arrangement = "horizontal", pageOption) {
        console.log(target, data, itemsPerSlide, arrangement);
        if (!target || !data) {
            throw new Error("Target and data are required.");
        }

        if (!$(target).length) {
            throw new Error("Target is invalid.");
        }

        if (arrangement == "grid" && !pageOption) {
            throw new Error("pageOption is required.");
        }

        this.target = target;
        this.data = data;
        this.itemsPerSlide = itemsPerSlide;
        this.arrangement = arrangement;
        this.pageOption = pageOption;
    }

    start() {
        $(this.target).empty();

        let containerDiv = $("<div>").attr("class", "container-fluid");
        let innerDiv = $("<div>").attr("class", "row justify-content-center");

        if (this.arrangement === "horizontal") {
            let carouselId = this.data.product_category_title.toLowerCase().trim().replace(/ /g, "_") + "_carousel_" + ($(".carousel").length + 1);

            let carouselDiv = $("<div>").attr({
                "id": carouselId,
                "class": "carousel slide",
                "data-ride": "carousel"
            }).appendTo(containerDiv);

            let headDiv = $("<div>").attr("class", "d-flex justify-content-between m-3").appendTo(carouselDiv);
            headDiv.append(
                `<div>
                                        <span class="h4">${this.data.product_category_title}</span>
                                        <span><a href="${this.data.seealllink}" class="h5 text-secondary pl-3">See All <i class="fa fa-arrow-right"></i></a></span>
                                    </div>`
            );

            let prevSlideAnchor = $("<a>")
                .append('<i class="fa fa-angle-double-left"></i>')
                .attr({
                    "href": "#" + carouselId,
                    "class": "btn btn-outline-primary rounded-circle",
                    "data-slide": "prev"
                });

            let nextSlideAnchor = $("<a>")
                .append('<i class="fa fa-angle-double-right"></i>')
                .attr({
                    "href": "#" + carouselId,
                    "class": "btn btn-outline-primary rounded-circle ml-2",
                    "data-slide": "next"
                });

            headDiv.append($("<div>").append(prevSlideAnchor, nextSlideAnchor));

            innerDiv.attr("role", "listbox");
            innerDiv.addClass("carousel-inner w-100 mx-auto");
            innerDiv.appendTo(carouselDiv);

            let itemsPerSlide = this.itemsPerSlide;

            (function ($) {
                carouselDiv.on("slide.bs.carousel", function (e) {
                    let index = $(e.relatedTarget).index();
                    let totalItems = innerDiv.find(".carousel-item").length;
                    console.log("itemsPerSlide", itemsPerSlide);
                    if (index >= totalItems - (itemsPerSlide - 1)) {
                        let it = itemsPerSlide - (totalItems - index);
                        for (let i = 0; i < it; i++) {
                            (e.direction == "left") ?
                                innerDiv.find(".carousel-item").eq(i).appendTo(innerDiv) : innerDiv.find(".carousel-item").eq(0).appendTo(innerDiv);
                        }
                    }
                });
            })(jQuery);
        } else if (this.arrangement === "grid") {
            containerDiv.append(
                `<div class="row">
                                        <div class="col-md-12">
                                            <div class="card mb-3">
                                                <div class="card-body bg-transparent p-1">
                                                    <h3 class="text-center">${this.data.product_category_title}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
            );

            innerDiv.appendTo(containerDiv);
        }

        let arrangement = this.arrangement;

        $.each(this.data.products, function (key, value) {
            let carouselItem = $("<div>")
                .attr({
                    "class": `${arrangement === "horizontal" ? "carousel-item" : ""}
                                                    ${(key == 0 && arrangement === "horizontal") ? "active" : ""}`,
                    "style": "width:" + "220" + "px; margin:0px 5px;"
                }).appendTo(innerDiv);

            let card = $("<div>").attr("class", `card mb-2`).appendTo(carouselItem);
            card.append(`<img class="card-img-top" src="${value.imagesrc}" height="160" />`);

            let cardBody = $("<div>").attr("class", `card-body`).appendTo(card);
            cardBody.append(`<h6 class="card-title" style="color:black; line-height:1.5em; min-height:3.0em; padding:0px; margin:0px;">${value.title}</h6>`);

            let div = $("<div>").attr("class", `d-flex justify-content-between`).appendTo(cardBody);

            div.append(
                `<div class="d-flex flex-column justify-content-between">
                                        <div>
                                            <span> <span>&#2547; </span> ${value.currentprice} </span>
                                        </div>
                                        <div style='font-size:12px; color:red;'>
                                            <del> <span> <span>&#2547; </span> ${value.previousprice} </span> </del>
                                        </div>
                                    </div>`
            );

            let buyNowButton = $("<button>")
                .attr("class", "btn btn-sm btn-outline-primary")
                .append("Buy Now")
                .appendTo($("<span>").appendTo(div));

            (function ($) {
                buyNowButton.on("click", function (e) {
                    console.log("Buy " + value.title);
                });
            })(jQuery);
        });

        if (this.arrangement === "grid") {
            let div = $("<div>").attr("class", "d-flex justify-content-center my-2").appendTo(containerDiv);

            var pagination1 = new CPagination(div, this.pageOption.totalPageCount, this.pageOption.showPageCount, this.pageOption.currentPageNo, this.pageOption.callback);
            pagination1.start();
        }

        containerDiv.appendTo($(this.target));
    }
};
