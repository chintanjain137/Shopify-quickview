/* Create a new Javascript file into assets folder of your theme */

document.addEventListener('DOMContentLoaded', function () {
    const changeOptions = () => {
        document.querySelectorAll(".main-options input").forEach((e) => {
            e.addEventListener("change", (evt) => {
                var checked_size = document.querySelectorAll(".main-options input:checked").length;
                if (checked_size > 1) {
                    let options_value = [];
                    document.querySelectorAll(".main-options input:checked").forEach((e) => {
                        let Selected_val = e.value;
                        options_value.push(Selected_val);
                    });
                    var variant_title = options_value.join(" / ");
                    var Selected_Variant = Number(evt.target.closest(".pro-information").querySelector(".all_variants_main input[data-title='" + variant_title + "']").value);
                    document.querySelector(".custom-quick-add").dataset.id = Selected_Variant;
                } else {
                    var checked_value = document.querySelectorAll(".main-options input:checked")[0].value;
                    var match_title = Number(evt.target.closest(".pro-information").querySelector(".all_variants_main input[data-title='" + checked_value + "']").value);
                    document.querySelector(".custom-quick-add").dataset.id = match_title;
                }
                Add_to_cart();
            });
        });
    };

    const Add_to_cart_function = (id) => {
        let formData = {
            'items': [{
                'id': id,
                'quantity': 1
            }]
        };
        fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            return response.json();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const Add_to_cart = () => {
        document.querySelector(".custom-quick-add").addEventListener("click", (e) => {
            var var_id = Number(e.target.dataset.id);
            Add_to_cart_function(var_id);
        });
    };

    const closePopup = () => {
        document.querySelector(".quickview_popup").classList.remove("active");
        document.querySelector(".quickview_popup").style.display = 'none';
    };

    document.querySelectorAll(".custom-quickview").forEach((e) => {
        e.addEventListener("click", function (evt) {
            var $gt_handle = evt.target.dataset.handle;
            fetch(`/products/${$gt_handle}.json`).then((response) => {
                return response.json();
            }).then((data) => {
                var $product = data.product;

                // variant options js starts from here
                var variant_options = document.createElement("div");
                variant_options.setAttribute("class", `main-options`);
                $product.options.forEach((option) => {
                    var option_values = document.createElement("div");
                    option_values.setAttribute("class", `main-option-${option.name}`);
                    option.values.forEach((value, index) => {
                        let label = document.createElement("label");
                        label.innerText = value;
                        label.setAttribute("for", `${index}-${value}`);
                        let input = document.createElement("input");
                        input.type = "radio";
                        input.name = option.name;
                        input.value = value;
                        input.setAttribute("id", `${index}-${value}`);
                        label.appendChild(input);
                        option_values.appendChild(label);
                    });
                    var wrapper = document.createElement("div");
                    wrapper.appendChild(option_values);
                    var string_options = wrapper.innerHTML;
                    var radio_options = `
                        <div class="option-${option.name}">
                            <h6>${option.name}</h6>
                            ${string_options}
                        </div>
                    `;
                    variant_options.innerHTML += radio_options;
                });
                // end here

                // variants loop starts from here
                var variants_main = document.createElement("div");
                variants_main.setAttribute("class", "all_variants_main");
                $product.variants.forEach((e) => {
                    let var_input = document.createElement("input");
                    var_input.type = "hidden";
                    var_input.value = e.id;
                    var_input.name = "variant";
                    var_input.dataset.title = e.title;
                    variants_main.appendChild(var_input);
                });
                let variant_wrapper = document.createElement("div");
                variant_wrapper.appendChild(variants_main);
                let final_Variants = variant_wrapper.innerHTML;
                // end

                // append all html
                var options_wrapper = document.createElement("div");
                options_wrapper.appendChild(variant_options);
                var string_options_main = options_wrapper.innerHTML;
                var $html = `
                    <div class="product-main">
                        <div class="product-media">
                            <img src="${$product.image.src}" alt="${$product.handle}">
                        </div>
                        <div class="pro-information">
                            ${final_Variants}
                            <h5>${$product.title}</h5>
                            <p class="price"></p>
                            ${string_options_main}
                            <button type="button" data-id="" class="custom-quick-add">Add to cart</button>
                        </div>
                    </div>
                `;
                document.querySelector(".quickview_popup .quickview_pro_inner").innerHTML = $html;
                document.querySelector(".quickview_popup").style.display = 'block';
                document.querySelector(".quickview_popup").classList.add("active");
                changeOptions();
                
                // Add event listener for mouse out to close popup
                document.querySelector(".quickview_popup").addEventListener("mouseleave", closePopup);
            });
        });
    });
});

