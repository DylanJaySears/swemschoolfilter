<script>
    $(document).ready(function(){
        var hideButtonsFor = ['Clinics and Certifications','Camp'];

        const loadingImgTag = `<div class="loading-loader text-center"><img id="loaderImg" src="https://bafybeif5s2ylscpk4hzu7wl22rwt72vxty3aefbsqoijuphspm3vkvczsm.ipfs.dweb.link/52102-searching.gif">
        <div class="text-center"><h5 class="search-text">Please wait while we search for classes...</h5></div>
        </div>`;

        const noDataImgTag = `<div class="text-center no-data-div"><img class="no-data-img" src="https://bafybeiaaqzfmhgwhpbo2dzpx7ayqsqd57bn3wfmfw3bvk7uhe25bc23l3m.ipfs.dweb.link/no-swimming.png"> <h6 class="no-data-txt">No available classes</h6><p class="text-center empty-text">Please search for available classes</div>`;

        function setMinHeight(){
            const isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))
            if(isMobile == false){
                $('.jackrabbit-tables-wrapper').css({minHeight: $('.schedule-filter .filter-section .filters-vertical').outerHeight()});
            }
        }

        function scrollToSection(){
            const isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))
            let minusValue = 155
            if(isMobile){
                minusValue = 10
            }
            if($(".schedule-filter").offset().top == 0){
                var scrollStart = $('.hero-image').height() + 200;
            }else{
                var scrollStart = $(".schedule-filter").offset().top - minusValue;
            }
            $('body,html').animate({ scrollTop: scrollStart }, 800);
        }

        function scrollToHeader(){
            const isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))
            let minusValue = 160
            if(isMobile){
                minusValue = 10
            }
            const scrollStart = $(".jackrabbit-tables-wrapper").offset().top - minusValue;
            $('body,html').animate({ scrollTop: scrollStart }, 800);
        }
        function callApi(){
            var selectedItem = $('#CMS-Select').val();
            if(hideButtonsFor.includes(selectedItem)){
                $(".sort-button").removeClass("fltr-active").css({display: 'none'});
                $("a[filter-by='all']").addClass("fltr-active").css({display: ''});
            }else{
                $(".sort-button").css({display: ''});
            }

            const Cat1 = $('select[name="CMS-Select"]').val();
            var Cat3 = $("#CMS-Select-3 label input:checked").val();
            Cat3 = Cat3 == undefined ? '' : Cat3;
            const Location = $('select[name="CMS-Select-2"]').val();
            let filterByValue = "",dayName="";
            $(".sort-button").each(function() {
                if($(this).hasClass("fltr-active")){
                    if($(this).attr("filter-by") != 'all'){
                        filterByValue = $(this).attr("filter-by");
                        dayName = filterByValue;
                    }
                }
            });

            filterByValue = filterByValue != "" ? `&Classdays=${filterByValue.substring(0,3)}` : "&Classdays=";

            var headerTitle = dayName == "" ? $("#CMS-Select").val() : $("#CMS-Select").val() + " - " + dayName;

            const LocationVar = Location ? `&loc=${Location}` : "";
                $("#jackrabbit-tables").html(loadingImgTag);

                $("#jackrabbit-tables").html(loadingImgTag);
                setTimeout(scrollToHeader, 50);

                var settings = {
                    "url": `https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJS?OrgID=539784&Cat1=${Cat1}&Cat3=${Cat3}${filterByValue}&Session&Cat2&sort=Classdays,StartDate&style=color:black&registertext=Enroll&Closed=Full&style=font-family:Open-Sans&hidecols=Description,Session,StartDate,EndDate,Gender&showcols=Instructors,Location${LocationVar}&showlocname=true`,
                };

                $.ajax({
                    url:`https://api.allorigins.win/get?url=${encodeURIComponent(settings.url)}`,
                    type: 'get',
                    success: function(data){
                        let doc = new DOMParser().parseFromString(data.contents, "text/html");
                        let contaiberJs = ( doc.querySelector(".jr-container") ) ? doc.querySelector(".jr-container").outerHTML : "";
                        let style = doc.querySelector("style").outerHTML;
                        let headerHtml = `<div>
                                            <div class="orange-divider schedule-divider" bis_skin_checked="1"></div>
                                            <h2 class="schedule-title">${headerTitle}</h2>
                                            <div class="orange-divider schedule-divider" bis_skin_checked="1"></div>
                                            </div>`
                        if(contaiberJs === "") {
                            $("#jackrabbit-tables").html(headerHtml + noDataImgTag)
                        } else {
                            $("#jackrabbit-tables").html(headerHtml + contaiberJs)
                            removeFirstDataAttrFromTd()
                        }
                        scrollToHeader()
                        $('.styleCss').html(style + `<style>@media (max-width: 450px) { .jr-container {margin: 0;}}</style>`);

                    }
                });
        }
        function removeFirstDataAttrFromTd() {
            $(".responsive-table").find("tr").each(function(){
                const firstTd = $(this).find("td").eq(0);
                    firstTd.removeAttr("data-title");
                    if(firstTd.text().includes("Enroll")){
                    firstTd.find("a").addClass("enroll-style")
                    } else if(firstTd.text().includes("Waitlist")){
                    firstTd.find("a").addClass("waitlist-style")
                    } else {
                        firstTd.find("a").addClass("enroll-style")
                    }

                    const priceTd = $(this).find("td[data-title='Tuition']");
                    priceTd.html(`<span class='price-style'>$${priceTd.text().trim()}</span>`);
            })
        }

        $('select[name="CMS-Select"]').unbind("change");
        $('select[name="CMS-Select"]').change(function(e){
            callApi();
            e.preventDefault();
            e.stopPropagation();
            return false;
        })
        $('select[name="CMS-Select-2"]').unbind("change");
        $('select[name="CMS-Select-2"]').change(function(e){
            callApi();
            e.preventDefault();
            e.stopPropagation();
            return false;
        })

        $(".sort-button").unbind("change");

        $(document).on("click",".sort-button",function(e) {
            if($(this).hasClass("fltr-active")){
                $(".sort-button").removeClass("fltr-active");
                $("a[filter-by='all']").addClass("fltr-active");
            } else {
                $(".sort-button").removeClass("fltr-active");
                $(this).addClass("fltr-active");
            }
            callApi()
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        $("#CMS-Select-3 label input").change(function(){
            callApi()
            e.preventDefault();
            e.stopPropagation();
            return false;
        });


        $(".pricing-card").click(function(e){
            const html = $(this).html();
            const isYouth = html.includes("Youth") ? true : false
            const isAdult = html.includes("Adult") ? true : false
            const isParentAndTot = html.includes("Parent") ? true : false
            const isClinicsandCertifications = html.includes("Clinics and Certifications") ? true : false
            const isToddler = html.includes("Toddler") ? true : false
            const isCamp = html.includes("Camp") ? true : false
            const isprivateandsemiprivateclasses = html.includes("Private and Semi - Private Classes") ? true : false
            if (isYouth) {
                $("#CMS-Select").val("Youth");
            } else if (isAdult) {
                $("#CMS-Select").val("Adult");
            } else if (isParentAndTot) {
                $("#CMS-Select").val("Parent and Tot");
            } else if (isClinicsandCertifications) {
                $("#CMS-Select").val("Clinics and Certifications");
            } else if (isToddler) {
                $("#CMS-Select").val("Toddler");
            } else if (isCamp) {
                $("#CMS-Select").val("Camp");
            } else if (isprivateandsemiprivateclasses) {
                $("#CMS-Select").val("Private and Semi - Private Classes");
            }

            callApi()
            $(".schedule-filter").show();
            setTimeout(setMinHeight, 50);
            $("a[filter-by='all']").addClass("fltr-active");
            $("#CMS-Select-3 #All input").prop("checked", true);
            $("body").append(`<div class="styleCss"></div>`);
            $(".page-section").hide();
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        $("body").append('<a id="scroll-top"><img src="https://bafybeihycc5uzx3qx7x5etylpqj4sgnbyrxqjof5nvunptt7skwjwdvifm.ipfs.dweb.link/Vector.png" /></a>');

        var btn = $('#scroll-top');

        $(window).scroll(function() {
            if ($(window).scrollTop() > 800) {
            btn.addClass('show');
            } else {
            btn.removeClass('show');
            }
        });

        btn.on('click', function(e) {
            e.preventDefault();
            scrollToSection();
        });
    });
    </script>
