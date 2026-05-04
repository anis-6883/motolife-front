# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/wishlist.spec.ts >> 🧪 Wishlist Feature — Full QA Suite >> ✅ Case 5: Wishlist drawer opens and shows added item
- Location: tests/wishlist.spec.ts:135:7

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('button', { name: /login/i }) resolved to 2 elements:
    1) <button type="submit" data-slot="button" data-size="default" data-variant="default" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md [@media(min-width:400px)]:text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary hover:bg-primary/90 h-9 has…>Login</button> aka getByRole('banner').getByRole('button', { name: 'Login' })
    2) <button data-slot="button" data-variant="link" data-size="default" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs [@media(min-width:400px)]:text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive underline-offset-4 h-9 px-4 py-2 has-[>svg]:px-3 h-max! p-0…>…</button> aka getByRole('contentinfo').getByRole('button', { name: 'Login' })

Call log:
  - waiting for getByRole('button', { name: /login/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e6] [cursor=pointer]:
        - button "Open Next.js Dev Tools" [ref=e7]:
            - img [ref=e8]
        - generic [ref=e11]:
            - button "Open issues overlay" [ref=e12]:
                - generic [ref=e13]:
                    - generic [ref=e14]: "0"
                    - generic [ref=e15]: "1"
                - generic [ref=e16]: Issue
            - button "Collapse issues badge" [ref=e17]:
                - img [ref=e18]
    - generic [ref=e20]:
        - banner [ref=e21]:
            - generic [ref=e23]:
                - link "Logo" [ref=e25] [cursor=pointer]:
                    - /url: /
                    - img "Logo" [ref=e27]
                - generic [ref=e28]:
                    - generic [ref=e29]:
                        - button [ref=e30] [cursor=pointer]:
                            - img
                        - heading "Delete Confirmation Modal" [level=2] [ref=e31]
                    - button "Login" [ref=e33] [cursor=pointer]
            - generic [ref=e37]:
                - button "All Category" [ref=e39] [cursor=pointer]:
                    - generic [ref=e40]: All Category
                    - img [ref=e41]
                - generic [ref=e43]:
                    - link "Brands" [ref=e44] [cursor=pointer]:
                        - /url: /brands
                    - link "Products" [ref=e45] [cursor=pointer]:
                        - /url: /product-list
                    - link "Combo Offer" [ref=e46] [cursor=pointer]:
                        - /url: /combo-offers
                    - link "Track Order" [ref=e47] [cursor=pointer]:
                        - /url: /track-order
                    - link "Contact" [ref=e48] [cursor=pointer]:
                        - /url: /contact-us
        - main [ref=e49]:
            - generic [ref=e51]:
                - region [ref=e54]:
                    - generic [ref=e56]:
                        - group [ref=e57]:
                            - link "Alt val":
                                - /url: /product-list
                                - img "Alt val" [ref=e59] [cursor=pointer]
                        - group [ref=e60]:
                            - link "Alt val":
                                - /url: /product-list
                                - img "Alt val" [ref=e62] [cursor=pointer]
                        - group [ref=e63]:
                            - link "Alt val":
                                - /url: /combo-offers
                                - img "Alt val" [ref=e65] [cursor=pointer]
                        - group [ref=e66]:
                            - link "Alt val":
                                - /url: /new-img
                                - img "Alt val" [ref=e68] [cursor=pointer]
                    - generic [ref=e69]:
                        - button "Go to slide 1" [ref=e70] [cursor=pointer]
                        - button "Go to slide 2" [ref=e71] [cursor=pointer]
                        - button "Go to slide 3" [ref=e72] [cursor=pointer]
                        - button "Go to slide 4" [ref=e73] [cursor=pointer]
                - generic [ref=e74]:
                    - heading "Categories" [level=2] [ref=e75]
                    - region [ref=e76]:
                        - generic [ref=e78]:
                            - group [ref=e79]:
                                - link "Engine oil Engine oil Engine oil" [ref=e80] [cursor=pointer]:
                                    - /url: /product-list?category=Engine oil
                                    - generic [ref=e82]:
                                        - generic [ref=e83]: Engine oil
                                        - img "Engine oil" [ref=e85]
                                        - paragraph [ref=e86]: Engine oil
                            - group [ref=e87]:
                                - link "Bike Tyre Bike Tyre Bike Tyre" [ref=e88] [cursor=pointer]:
                                    - /url: /product-list?category=Bike Tyre
                                    - generic [ref=e90]:
                                        - generic [ref=e91]: Bike Tyre
                                        - img "Bike Tyre" [ref=e93]
                                        - paragraph [ref=e94]: Bike Tyre
                            - group [ref=e95]:
                                - link "Helmet Helmet Helmet" [ref=e96] [cursor=pointer]:
                                    - /url: /product-list?category=Helmet
                                    - generic [ref=e98]:
                                        - generic [ref=e99]: Helmet
                                        - img "Helmet" [ref=e101]
                                        - paragraph [ref=e102]: Helmet
                            - group [ref=e103]:
                                - link "Hand gloves Hand gloves Hand gloves" [ref=e104] [cursor=pointer]:
                                    - /url: /product-list?category=Hand gloves
                                    - generic [ref=e106]:
                                        - generic [ref=e107]: Hand gloves
                                        - img "Hand gloves" [ref=e109]
                                        - paragraph [ref=e110]: Hand gloves
                            - group [ref=e111]:
                                - link "Bike Accessories Bike Accessories Bike Accessories" [ref=e112] [cursor=pointer]:
                                    - /url: /product-list?category=Bike Accessories
                                    - generic [ref=e114]:
                                        - generic [ref=e115]: Bike Accessories
                                        - img "Bike Accessories" [ref=e117]
                                        - paragraph [ref=e118]: Bike Accessories
                            - group [ref=e119]:
                                - link "Bike Locks Bike Locks Bike Locks" [ref=e120] [cursor=pointer]:
                                    - /url: /product-list?category=Bike Locks
                                    - generic [ref=e122]:
                                        - generic [ref=e123]: Bike Locks
                                        - img "Bike Locks" [ref=e125]
                                        - paragraph [ref=e126]: Bike Locks
                - generic [ref=e129]:
                    - 'link "flash sale image banner 53 Days : 18 Hours : 43 Minutes : 56 Seconds" [ref=e130] [cursor=pointer]':
                        - /url: /product-list/offers/flash-sale-0wltkftyhry6z54
                        - img "flash sale image banner" [ref=e131]
                        - generic [ref=e133]:
                            - generic [ref=e134]:
                                - generic [ref=e136]: "53"
                                - generic [ref=e137]: Days
                            - paragraph [ref=e138]: ":"
                            - generic [ref=e139]:
                                - generic [ref=e141]: "18"
                                - generic [ref=e142]: Hours
                            - paragraph [ref=e143]: ":"
                            - generic [ref=e144]:
                                - generic [ref=e146]: "43"
                                - generic [ref=e147]: Minutes
                            - paragraph [ref=e148]: ":"
                            - generic [ref=e149]:
                                - generic [ref=e151]: "56"
                                - generic [ref=e152]: Seconds
                    - generic [ref=e153]:
                        - heading "Flash Sale" [level=2] [ref=e155]
                        - region [ref=e156]:
                            - generic [ref=e158]:
                                - group [ref=e159]:
                                    - link "200 ৳ off Thor Sector MIPS Order now Thor Sector MIPS 11800.00৳ 12000.00৳" [ref=e160] [cursor=pointer]:
                                        - /url: /product-list/thor-sector-mips-h7udh235wfbhxud
                                        - generic [ref=e161]:
                                            - generic [ref=e162]:
                                                - generic [ref=e164]: 200 ৳ off
                                                - img "Thor Sector MIPS" [ref=e166]
                                                - button "Order now" [ref=e168]
                                            - generic [ref=e169]:
                                                - generic [ref=e172]: Thor Sector MIPS
                                                - generic [ref=e175]:
                                                    - generic [ref=e176]: 11800.00৳
                                                    - generic [ref=e177]: 12000.00৳
                                                - button [ref=e180]:
                                                    - img
                                - group [ref=e181]:
                                    - link "200 ৳ off X2 Helmet Snow White Order now X2 Helmet Snow White 3300.00৳ 3500.00৳" [ref=e182] [cursor=pointer]:
                                        - /url: /product-list/x2-helmet-snow-white-c9j842rgiu9bnji
                                        - generic [ref=e183]:
                                            - generic [ref=e184]:
                                                - generic [ref=e186]: 200 ৳ off
                                                - img "X2 Helmet Snow White" [ref=e188]
                                                - button "Order now" [ref=e190]
                                            - generic [ref=e191]:
                                                - generic [ref=e194]: X2 Helmet Snow White
                                                - generic [ref=e197]:
                                                    - generic [ref=e198]: 3300.00৳
                                                    - generic [ref=e199]: 3500.00৳
                                                - button [ref=e202]:
                                                    - img
                                - group [ref=e203]:
                                    - link "10 % off CEAT Zoom Rad X1 Front Tyre Order now CEAT Zoom Rad X1 Front Tyre 2925.00৳ 3250.00৳ 5.0" [ref=e204] [cursor=pointer]:
                                        - /url: /product-list/ceat-zoom-rad-x1-front-tyre-hb5swnt48k6pocv
                                        - generic [ref=e205]:
                                            - generic [ref=e206]:
                                                - generic [ref=e208]: 10 % off
                                                - img "CEAT Zoom Rad X1 Front Tyre" [ref=e210]
                                                - button "Order now" [ref=e212]
                                            - generic [ref=e213]:
                                                - generic [ref=e216]: CEAT Zoom Rad X1 Front Tyre
                                                - generic [ref=e219]:
                                                    - generic [ref=e220]: 2925.00৳
                                                    - generic [ref=e221]: 3250.00৳
                                                - generic [ref=e222]:
                                                    - paragraph [ref=e223]:
                                                        - text: "5.0"
                                                        - img [ref=e224]
                                                    - button [ref=e227]:
                                                        - img
                - generic [ref=e231]:
                    - generic [ref=e232]:
                        - paragraph [ref=e233]: new arrival
                        - generic [ref=e234]:
                            - button "Previous" [ref=e235] [cursor=pointer]:
                                - img [ref=e236]
                            - button "Next" [ref=e238] [cursor=pointer]:
                                - img [ref=e239]
                    - region [ref=e241]:
                        - generic [ref=e243]:
                            - group [ref=e244]:
                                - link "1000 ৳ off ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার Order now ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার 7500.00৳ 8500.00৳ 4.0" [ref=e245] [cursor=pointer]:
                                    - /url: /product-list/gearx-reaper-metallic-grey-55vso5b2x4iviws
                                    - generic [ref=e246]:
                                        - generic [ref=e247]:
                                            - generic [ref=e249]: 1000 ৳ off
                                            - img "ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার" [ref=e251]
                                            - button "Order now" [ref=e253]
                                        - generic [ref=e254]:
                                            - generic [ref=e256]:
                                                - generic [ref=e257]: ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার
                                                - generic [ref=e258]: ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার
                                            - generic [ref=e261]:
                                                - generic [ref=e262]: 7500.00৳
                                                - generic [ref=e263]: 8500.00৳
                                            - generic [ref=e264]:
                                                - paragraph [ref=e265]:
                                                    - text: "4.0"
                                                    - img [ref=e266]
                                                - button [ref=e269]:
                                                    - img
                            - group [ref=e270]:
                                - link "500 ৳ off SteelBird SBH-17 Full Face Helmet Order now SteelBird SBH-17 Full Face Helmet SteelBird SBH-17 Full Face Helmet 2200.00৳ 2700.00৳" [ref=e271] [cursor=pointer]:
                                    - /url: /product-list/steelbird-sbh-17-full-face-helmet-trtumnbiccsncju
                                    - generic [ref=e272]:
                                        - generic [ref=e273]:
                                            - generic [ref=e275]: 500 ৳ off
                                            - img "SteelBird SBH-17 Full Face Helmet" [ref=e277]
                                            - button "Order now" [ref=e279]
                                        - generic [ref=e280]:
                                            - generic [ref=e282]:
                                                - generic [ref=e283]: SteelBird SBH-17 Full Face Helmet
                                                - generic [ref=e284]: SteelBird SBH-17 Full Face Helmet
                                            - generic [ref=e287]:
                                                - generic [ref=e288]: 2200.00৳
                                                - generic [ref=e289]: 2700.00৳
                                            - button [ref=e292]:
                                                - img
                            - group [ref=e293]:
                                - link "10 % off CEAT Zoom Rad X1 Front Tyre Order now CEAT Zoom Rad X1 Front Tyre 2925.00৳ 3250.00৳ 5.0" [ref=e294] [cursor=pointer]:
                                    - /url: /product-list/ceat-zoom-rad-x1-front-tyre-hb5swnt48k6pocv
                                    - generic [ref=e295]:
                                        - generic [ref=e296]:
                                            - generic [ref=e298]: 10 % off
                                            - img "CEAT Zoom Rad X1 Front Tyre" [ref=e300]
                                            - button "Order now" [ref=e302]
                                        - generic [ref=e303]:
                                            - generic [ref=e306]: CEAT Zoom Rad X1 Front Tyre
                                            - generic [ref=e309]:
                                                - generic [ref=e310]: 2925.00৳
                                                - generic [ref=e311]: 3250.00৳
                                            - generic [ref=e312]:
                                                - paragraph [ref=e313]:
                                                    - text: "5.0"
                                                    - img [ref=e314]
                                                - button [ref=e317]:
                                                    - img
                            - group [ref=e318]:
                                - link "20 % off MRF Zapper C1 Rear Tyre Order now MRF Zapper C1 Rear Tyre 3080.00৳ 3850.00৳ 5.0" [ref=e319] [cursor=pointer]:
                                    - /url: /product-list/mrf-zapper-c1-rear-tyre-gfhrovla6zkqbag
                                    - generic [ref=e320]:
                                        - generic [ref=e321]:
                                            - generic [ref=e323]: 20 % off
                                            - img "MRF Zapper C1 Rear Tyre" [ref=e325]
                                            - button "Order now" [ref=e327]
                                        - generic [ref=e328]:
                                            - generic [ref=e331]: MRF Zapper C1 Rear Tyre
                                            - generic [ref=e334]:
                                                - generic [ref=e335]: 3080.00৳
                                                - generic [ref=e336]: 3850.00৳
                                            - generic [ref=e337]:
                                                - paragraph [ref=e338]:
                                                    - text: "5.0"
                                                    - img [ref=e339]
                                                - button [ref=e342]:
                                                    - img
                            - group [ref=e343]:
                                - link "200 ৳ off X2 Helmet Snow White Order now X2 Helmet Snow White 3300.00৳ 3500.00৳" [ref=e344] [cursor=pointer]:
                                    - /url: /product-list/x2-helmet-snow-white-c9j842rgiu9bnji
                                    - generic [ref=e345]:
                                        - generic [ref=e346]:
                                            - generic [ref=e348]: 200 ৳ off
                                            - img "X2 Helmet Snow White" [ref=e350]
                                            - button "Order now" [ref=e352]
                                        - generic [ref=e353]:
                                            - generic [ref=e356]: X2 Helmet Snow White
                                            - generic [ref=e359]:
                                                - generic [ref=e360]: 3300.00৳
                                                - generic [ref=e361]: 3500.00৳
                                            - button [ref=e364]:
                                                - img
                            - group [ref=e365]:
                                - link "200 ৳ off Thor Sector MIPS Order now Thor Sector MIPS 11800.00৳ 12000.00৳" [ref=e366] [cursor=pointer]:
                                    - /url: /product-list/thor-sector-mips-h7udh235wfbhxud
                                    - generic [ref=e367]:
                                        - generic [ref=e368]:
                                            - generic [ref=e370]: 200 ৳ off
                                            - img "Thor Sector MIPS" [ref=e372]
                                            - button "Order now" [ref=e374]
                                        - generic [ref=e375]:
                                            - generic [ref=e378]: Thor Sector MIPS
                                            - generic [ref=e381]:
                                                - generic [ref=e382]: 11800.00৳
                                                - generic [ref=e383]: 12000.00৳
                                            - button [ref=e386]:
                                                - img
                    - link "Explore More" [ref=e388] [cursor=pointer]:
                        - /url: /product-list?isNew=true&page=1
                        - text: Explore More
                        - img
                - generic [ref=e389]:
                    - generic [ref=e390]:
                        - link "ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার -23% Best Seller ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার 264.88৳ 344.00 ৳" [ref=e391] [cursor=pointer]:
                            - /url: /combo-offers/cfmoto-150sc-jfmfe1hafsihp9z
                            - generic [ref=e392]:
                                - generic [ref=e393]:
                                    - generic [ref=e394]:
                                        - img "ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার" [ref=e395]
                                        - generic [ref=e396]: "-23%"
                                        - button [ref=e399]:
                                            - img
                                    - generic [ref=e400]:
                                        - generic [ref=e402]: Best Seller
                                        - heading "ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার" [level=3] [ref=e403]
                                - generic [ref=e404]:
                                    - generic [ref=e406]: 264.88৳
                                    - generic [ref=e407]:
                                        - text: "344.00"
                                        - generic [ref=e408]: ৳
                                - button [ref=e411]:
                                    - img
                        - link "Suzuki Gixxer Fi ABS -22% New arrival Suzuki Gixxer Fi ABS 218400.00৳ 280000.00 ৳" [ref=e412] [cursor=pointer]:
                            - /url: /combo-offers/suzuki-gixxer-fi-abs-ssyncoueppnxauw
                            - generic [ref=e413]:
                                - generic [ref=e414]:
                                    - generic [ref=e415]:
                                        - img "Suzuki Gixxer Fi ABS" [ref=e416]
                                        - generic [ref=e417]: "-22%"
                                        - button [ref=e420]:
                                            - img
                                    - generic [ref=e421]:
                                        - generic [ref=e423]: New arrival
                                        - heading "Suzuki Gixxer Fi ABS" [level=3] [ref=e424]
                                - generic [ref=e425]:
                                    - generic [ref=e427]: 218400.00৳
                                    - generic [ref=e428]:
                                        - text: "280000.00"
                                        - generic [ref=e429]: ৳
                                - button [ref=e432]:
                                    - img
                        - link "Yamaha FZS v2 -5000 ৳ Best Seller Yamaha FZS v2 234000.00৳ 239000.00 ৳" [ref=e433] [cursor=pointer]:
                            - /url: /combo-offers/yamaha-fzs-v2-nse7yz1zmgchgeq
                            - generic [ref=e434]:
                                - generic [ref=e435]:
                                    - generic [ref=e436]:
                                        - img "Yamaha FZS v2" [ref=e437]
                                        - generic [ref=e438]: "-5000 ৳"
                                        - button [ref=e441]:
                                            - img
                                    - generic [ref=e442]:
                                        - generic [ref=e444]: Best Seller
                                        - heading "Yamaha FZS v2" [level=3] [ref=e445]
                                - generic [ref=e446]:
                                    - generic [ref=e448]: 234000.00৳
                                    - generic [ref=e449]:
                                        - text: "239000.00"
                                        - generic [ref=e450]: ৳
                                - button [ref=e453]:
                                    - img
                        - link "Yamaha extends Eid offer Best Seller Yamaha extends Eid offer 500000.00৳" [ref=e454] [cursor=pointer]:
                            - /url: /combo-offers/yamaha-extends-eid-offer-ns7shdzdqybg5sr
                            - generic [ref=e455]:
                                - generic [ref=e456]:
                                    - generic [ref=e457]:
                                        - img "Yamaha extends Eid offer" [ref=e458]
                                        - button [ref=e461]:
                                            - img
                                    - generic [ref=e462]:
                                        - generic [ref=e464]: Best Seller
                                        - heading "Yamaha extends Eid offer" [level=3] [ref=e465]
                                - generic [ref=e468]: 500000.00৳
                                - button [ref=e471]:
                                    - img
                        - link "Bike Kit Combo -10% Best Seller Bike Kit Combo 4500.00৳ 5000.00 ৳" [ref=e472] [cursor=pointer]:
                            - /url: /combo-offers/bike-kit-combo-hpozczv57wosl70
                            - generic [ref=e473]:
                                - generic [ref=e474]:
                                    - generic [ref=e475]:
                                        - img "Bike Kit Combo" [ref=e476]
                                        - generic [ref=e477]: "-10%"
                                        - button [ref=e480]:
                                            - img
                                    - generic [ref=e481]:
                                        - generic [ref=e483]: Best Seller
                                        - heading "Bike Kit Combo" [level=3] [ref=e484]
                                - generic [ref=e485]:
                                    - generic [ref=e487]: 4500.00৳
                                    - generic [ref=e488]:
                                        - text: "5000.00"
                                        - generic [ref=e489]: ৳
                                - button [ref=e492]:
                                    - img
                        - link "A 4-In-1 Bicycle Handlebar Combo - Easy To Use And Clean, Ideal For Cyclists On The Go A 4-In-1 Bicycle Handlebar Combo - Easy To Use And Clean, Ideal For Cyclists On The Go 2000.00৳" [ref=e493] [cursor=pointer]:
                            - /url: /combo-offers/a-4-in-1-bicycle-handlebar-combo-easy-to-use-and-clean-ideal-for-cyclists-on-the-go-znfat7osc4t51np
                            - generic [ref=e494]:
                                - generic [ref=e495]:
                                    - generic [ref=e496]:
                                        - img "A 4-In-1 Bicycle Handlebar Combo - Easy To Use And Clean, Ideal For Cyclists On The Go" [ref=e497]
                                        - button [ref=e500]:
                                            - img
                                    - heading "A 4-In-1 Bicycle Handlebar Combo - Easy To Use And Clean, Ideal For Cyclists On The Go" [level=3] [ref=e502]
                                - generic [ref=e505]: 2000.00৳
                                - button [ref=e508]:
                                    - img
                        - link "Rider Essentials Combo Pack (Helmet + Gloves + Rain Coat) -15% Best Seller Rider Essentials Combo Pack (Helmet + Gloves + Rain Coat) 3825.00৳ 4500.00 ৳" [ref=e509] [cursor=pointer]:
                            - /url: /combo-offers/rider-essentials-combo-pack-helmet-gloves-rain-coat-it6fmree0knt5i4
                            - generic [ref=e510]:
                                - generic [ref=e511]:
                                    - generic [ref=e512]:
                                        - img "Rider Essentials Combo Pack (Helmet + Gloves + Rain Coat)" [ref=e513]
                                        - generic [ref=e514]: "-15%"
                                        - button [ref=e517]:
                                            - img
                                    - generic [ref=e518]:
                                        - generic [ref=e520]: Best Seller
                                        - heading "Rider Essentials Combo Pack (Helmet + Gloves + Rain Coat)" [level=3] [ref=e521]
                                - generic [ref=e522]:
                                    - generic [ref=e524]: 3825.00৳
                                    - generic [ref=e525]:
                                        - text: "4500.00"
                                        - generic [ref=e526]: ৳
                                - button [ref=e529]:
                                    - img
                    - generic [ref=e530]:
                        - link "Combo offer banner":
                            - /url: /combo-offers
                            - img "Combo offer banner" [ref=e531] [cursor=pointer]
                        - generic [ref=e532]:
                            - heading "COMBO OFFER! on Every Rider’s Favorite Gear" [level=3] [ref=e534]:
                                - generic [ref=e535]: COMBO
                                - text: OFFER! on Every Rider’s Favorite Gear
                            - paragraph [ref=e537]:
                                - strong [ref=e539]: Big savings on bundled helmets, gloves, oils & accessories.
                                - generic:
                                    - strong
                            - link "shop now" [ref=e540] [cursor=pointer]:
                                - /url: /combo-offers
                                - button "shop now" [ref=e541]:
                                    - text: shop now
                                    - img
                - generic [ref=e545]:
                    - paragraph [ref=e547]: Featured Products
                    - generic [ref=e548]:
                        - link "1000 ৳ off ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার Order now ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার 7500.00৳ 8500.00৳ 7500.00৳ 8500.00৳ 4.0" [ref=e549] [cursor=pointer]:
                            - /url: /product-list/gearx-reaper-metallic-grey-55vso5b2x4iviws
                            - generic [ref=e550]:
                                - generic [ref=e551]:
                                    - generic [ref=e553]: 1000 ৳ off
                                    - img "ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার" [ref=e555]
                                    - button "Order now" [ref=e557]
                                - generic [ref=e558]:
                                    - generic [ref=e560]:
                                        - generic [ref=e561]: ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার
                                        - generic [ref=e562]: ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার
                                    - generic [ref=e564]:
                                        - generic [ref=e565]:
                                            - generic [ref=e566]: 7500.00৳
                                            - generic [ref=e567]: 8500.00৳
                                        - generic [ref=e568]:
                                            - generic [ref=e569]: 7500.00৳
                                            - generic [ref=e570]: 8500.00৳
                                    - generic [ref=e571]:
                                        - paragraph [ref=e572]:
                                            - text: "4.0"
                                            - img [ref=e573]
                                        - button [ref=e576]:
                                            - img
                        - link "500 ৳ off SteelBird SBH-17 Full Face Helmet Order now SteelBird SBH-17 Full Face Helmet SteelBird SBH-17 Full Face Helmet 2200.00৳ 2700.00৳ 2200.00৳ 2700.00৳" [ref=e577] [cursor=pointer]:
                            - /url: /product-list/steelbird-sbh-17-full-face-helmet-trtumnbiccsncju
                            - generic [ref=e578]:
                                - generic [ref=e579]:
                                    - generic [ref=e581]: 500 ৳ off
                                    - img "SteelBird SBH-17 Full Face Helmet" [ref=e583]
                                    - button "Order now" [ref=e585]
                                - generic [ref=e586]:
                                    - generic [ref=e588]:
                                        - generic [ref=e589]: SteelBird SBH-17 Full Face Helmet
                                        - generic [ref=e590]: SteelBird SBH-17 Full Face Helmet
                                    - generic [ref=e592]:
                                        - generic [ref=e593]:
                                            - generic [ref=e594]: 2200.00৳
                                            - generic [ref=e595]: 2700.00৳
                                        - generic [ref=e596]:
                                            - generic [ref=e597]: 2200.00৳
                                            - generic [ref=e598]: 2700.00৳
                                    - button [ref=e601]:
                                        - img
                        - link "20 % off MRF Zapper C1 Rear Tyre Order now MRF Zapper C1 Rear Tyre MRF Zapper C1 Rear Tyre 3080.00৳ 3850.00৳ 3080.00৳ 3850.00৳ 5.0" [ref=e602] [cursor=pointer]:
                            - /url: /product-list/mrf-zapper-c1-rear-tyre-gfhrovla6zkqbag
                            - generic [ref=e603]:
                                - generic [ref=e604]:
                                    - generic [ref=e606]: 20 % off
                                    - img "MRF Zapper C1 Rear Tyre" [ref=e608]
                                    - button "Order now" [ref=e610]
                                - generic [ref=e611]:
                                    - generic [ref=e613]:
                                        - generic [ref=e614]: MRF Zapper C1 Rear Tyre
                                        - generic [ref=e615]: MRF Zapper C1 Rear Tyre
                                    - generic [ref=e617]:
                                        - generic [ref=e618]:
                                            - generic [ref=e619]: 3080.00৳
                                            - generic [ref=e620]: 3850.00৳
                                        - generic [ref=e621]:
                                            - generic [ref=e622]: 3080.00৳
                                            - generic [ref=e623]: 3850.00৳
                                    - generic [ref=e624]:
                                        - paragraph [ref=e625]:
                                            - text: "5.0"
                                            - img [ref=e626]
                                        - button [ref=e629]:
                                            - img
                - generic [ref=e630]:
                    - generic [ref=e632]:
                        - link "MRF Zapper C1 Rear Tyre -20% Best Seller MRF Zapper C1 Rear Tyre 5.0 3080.00৳ 3850.00 ৳" [ref=e633] [cursor=pointer]:
                            - /url: /product-list/mrf-zapper-c1-rear-tyre-gfhrovla6zkqbag
                            - generic [ref=e634]:
                                - generic [ref=e635]:
                                    - generic [ref=e636]:
                                        - img "MRF Zapper C1 Rear Tyre" [ref=e637]
                                        - generic [ref=e638]: "-20%"
                                        - button [ref=e641]:
                                            - img
                                    - generic [ref=e642]:
                                        - generic [ref=e644]: Best Seller
                                        - heading "MRF Zapper C1 Rear Tyre" [level=3] [ref=e645]
                                        - paragraph [ref=e647]:
                                            - text: "5.0"
                                            - img [ref=e648]
                                - generic [ref=e650]:
                                    - generic [ref=e652]: 3080.00৳
                                    - generic [ref=e653]:
                                        - text: "3850.00"
                                        - generic [ref=e654]: ৳
                                - button [ref=e657]:
                                    - img
                        - link "Suomy Motorcycle Riding Gloves – GREEN -150 ৳ Suomy Motorcycle Riding Gloves – GREEN 900.00৳ 1050.00 ৳" [ref=e658] [cursor=pointer]:
                            - /url: /product-list/suomy-motorcycle-riding-gloves-green-smdwwv0b3oofxhd
                            - generic [ref=e659]:
                                - generic [ref=e660]:
                                    - generic [ref=e661]:
                                        - img "Suomy Motorcycle Riding Gloves – GREEN" [ref=e662]
                                        - generic [ref=e663]: "-150 ৳"
                                        - button [ref=e666]:
                                            - img
                                    - heading "Suomy Motorcycle Riding Gloves – GREEN" [level=3] [ref=e668]
                                - generic [ref=e669]:
                                    - generic [ref=e671]: 900.00৳
                                    - generic [ref=e672]:
                                        - text: "1050.00"
                                        - generic [ref=e673]: ৳
                                - button [ref=e676]:
                                    - img
                        - link "SteelBird SBH-17 Full Face Helmet -500 ৳ Best Seller SteelBird SBH-17 Full Face Helmet 2200.00৳ 2700.00 ৳" [ref=e677] [cursor=pointer]:
                            - /url: /product-list/steelbird-sbh-17-full-face-helmet-trtumnbiccsncju
                            - generic [ref=e678]:
                                - generic [ref=e679]:
                                    - generic [ref=e680]:
                                        - img "SteelBird SBH-17 Full Face Helmet" [ref=e681]
                                        - generic [ref=e682]: "-500 ৳"
                                        - button [ref=e685]:
                                            - img
                                    - generic [ref=e686]:
                                        - generic [ref=e688]: Best Seller
                                        - heading "SteelBird SBH-17 Full Face Helmet" [level=3] [ref=e689]
                                - generic [ref=e690]:
                                    - generic [ref=e692]: 2200.00৳
                                    - generic [ref=e693]:
                                        - text: "2700.00"
                                        - generic [ref=e694]: ৳
                                - button [ref=e697]:
                                    - img
                    - link "Today's Deals Grab premium bike accessories at budget-friendly prices Best Deals" [ref=e698] [cursor=pointer]:
                        - /url: /product-list/best-deals/todays-deal-hayo6ccwd8d5vb6
                        - generic [ref=e699]:
                            - heading "Today's Deals" [level=4] [ref=e700]
                            - paragraph [ref=e701]: Grab premium bike accessories at budget-friendly prices
                        - img "Best Deals" [ref=e703]
                    - link "ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার -1000 ৳ Best Seller ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার 4.0 7500.00৳ 8500.00 ৳" [ref=e706] [cursor=pointer]:
                        - /url: /product-list/gearx-reaper-metallic-grey-55vso5b2x4iviws
                        - generic [ref=e707]:
                            - generic [ref=e708]:
                                - generic [ref=e709]:
                                    - img "ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার" [ref=e710]
                                    - generic [ref=e711]: "-1000 ৳"
                                    - button [ref=e714]:
                                        - img
                                - generic [ref=e715]:
                                    - generic [ref=e717]: Best Seller
                                    - heading "ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার" [level=3] [ref=e718]
                                    - paragraph [ref=e720]:
                                        - text: "4.0"
                                        - img [ref=e721]
                            - generic [ref=e723]:
                                - generic [ref=e725]: 7500.00৳
                                - generic [ref=e726]:
                                    - text: "8500.00"
                                    - generic [ref=e727]: ৳
                            - button [ref=e730]:
                                - img
                - generic [ref=e734]:
                    - paragraph [ref=e736]: Our Best Helmet Collection
                    - region [ref=e737]:
                        - generic [ref=e739]:
                            - group [ref=e740]:
                                - link "1000 ৳ off ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার Order now ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার 7500.00৳ 8500.00৳ 4.0" [ref=e741] [cursor=pointer]:
                                    - /url: /product-list/gearx-reaper-metallic-grey-55vso5b2x4iviws
                                    - generic [ref=e742]:
                                        - generic [ref=e743]:
                                            - generic [ref=e745]: 1000 ৳ off
                                            - img "ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার" [ref=e747]
                                            - button "Order now" [ref=e749]
                                        - generic [ref=e750]:
                                            - generic [ref=e752]:
                                                - generic [ref=e753]: ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার
                                                - generic [ref=e754]: ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার
                                            - generic [ref=e757]:
                                                - generic [ref=e758]: 7500.00৳
                                                - generic [ref=e759]: 8500.00৳
                                            - generic [ref=e760]:
                                                - paragraph [ref=e761]:
                                                    - text: "4.0"
                                                    - img [ref=e762]
                                                - button [ref=e765]:
                                                    - img
                            - group [ref=e766]:
                                - link "500 ৳ off SteelBird SBH-17 Full Face Helmet Order now SteelBird SBH-17 Full Face Helmet SteelBird SBH-17 Full Face Helmet 2200.00৳ 2700.00৳" [ref=e767] [cursor=pointer]:
                                    - /url: /product-list/steelbird-sbh-17-full-face-helmet-trtumnbiccsncju
                                    - generic [ref=e768]:
                                        - generic [ref=e769]:
                                            - generic [ref=e771]: 500 ৳ off
                                            - img "SteelBird SBH-17 Full Face Helmet" [ref=e773]
                                            - button "Order now" [ref=e775]
                                        - generic [ref=e776]:
                                            - generic [ref=e778]:
                                                - generic [ref=e779]: SteelBird SBH-17 Full Face Helmet
                                                - generic [ref=e780]: SteelBird SBH-17 Full Face Helmet
                                            - generic [ref=e783]:
                                                - generic [ref=e784]: 2200.00৳
                                                - generic [ref=e785]: 2700.00৳
                                            - button [ref=e788]:
                                                - img
                            - group [ref=e789]:
                                - link "200 ৳ off X2 Helmet Snow White Order now X2 Helmet Snow White 3300.00৳ 3500.00৳" [ref=e790] [cursor=pointer]:
                                    - /url: /product-list/x2-helmet-snow-white-c9j842rgiu9bnji
                                    - generic [ref=e791]:
                                        - generic [ref=e792]:
                                            - generic [ref=e794]: 200 ৳ off
                                            - img "X2 Helmet Snow White" [ref=e796]
                                            - button "Order now" [ref=e798]
                                        - generic [ref=e799]:
                                            - generic [ref=e802]: X2 Helmet Snow White
                                            - generic [ref=e805]:
                                                - generic [ref=e806]: 3300.00৳
                                                - generic [ref=e807]: 3500.00৳
                                            - button [ref=e810]:
                                                - img
                            - group [ref=e811]:
                                - link "200 ৳ off Thor Sector MIPS Order now Thor Sector MIPS 11800.00৳ 12000.00৳" [ref=e812] [cursor=pointer]:
                                    - /url: /product-list/thor-sector-mips-h7udh235wfbhxud
                                    - generic [ref=e813]:
                                        - generic [ref=e814]:
                                            - generic [ref=e816]: 200 ৳ off
                                            - img "Thor Sector MIPS" [ref=e818]
                                            - button "Order now" [ref=e820]
                                        - generic [ref=e821]:
                                            - generic [ref=e824]: Thor Sector MIPS
                                            - generic [ref=e827]:
                                                - generic [ref=e828]: 11800.00৳
                                                - generic [ref=e829]: 12000.00৳
                                            - button [ref=e832]:
                                                - img
                - generic [ref=e833]:
                    - heading "Just For You" [level=4] [ref=e834]
                    - generic [ref=e835]:
                        - link "10 % off ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার Order now ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার 310.50৳ 345.00৳" [ref=e836] [cursor=pointer]:
                            - /url: /product-list/cfmoto-150sc-g8i9yzpjj4b5cs7
                            - generic [ref=e837]:
                                - generic [ref=e838]:
                                    - generic [ref=e840]: 10 % off
                                    - img "ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার" [ref=e842]
                                    - button "Order now" [ref=e844]
                                - generic [ref=e845]:
                                    - generic [ref=e847]:
                                        - generic [ref=e848]: ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার
                                        - generic [ref=e849]: ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার
                                    - generic [ref=e852]:
                                        - generic [ref=e853]: 310.50৳
                                        - generic [ref=e854]: 345.00৳
                                    - button [ref=e857]:
                                        - img
                        - link "1000 ৳ off ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার Order now ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার 7500.00৳ 8500.00৳ 4.0" [ref=e858] [cursor=pointer]:
                            - /url: /product-list/gearx-reaper-metallic-grey-55vso5b2x4iviws
                            - generic [ref=e859]:
                                - generic [ref=e860]:
                                    - generic [ref=e862]: 1000 ৳ off
                                    - img "ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার" [ref=e864]
                                    - button "Order now" [ref=e866]
                                - generic [ref=e867]:
                                    - generic [ref=e869]:
                                        - generic [ref=e870]: ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার
                                        - generic [ref=e871]: ফেব্রুয়ারী মাসেCFMOTO 150SCবাইকটা কিনলেই পাচ্ছেন ভ্যালেন্টাইন অফার
                                    - generic [ref=e874]:
                                        - generic [ref=e875]: 7500.00৳
                                        - generic [ref=e876]: 8500.00৳
                                    - generic [ref=e877]:
                                        - paragraph [ref=e878]:
                                            - text: "4.0"
                                            - img [ref=e879]
                                        - button [ref=e882]:
                                            - img
                        - link "500 ৳ off SteelBird SBH-17 Full Face Helmet Order now SteelBird SBH-17 Full Face Helmet SteelBird SBH-17 Full Face Helmet 2200.00৳ 2700.00৳" [ref=e883] [cursor=pointer]:
                            - /url: /product-list/steelbird-sbh-17-full-face-helmet-trtumnbiccsncju
                            - generic [ref=e884]:
                                - generic [ref=e885]:
                                    - generic [ref=e887]: 500 ৳ off
                                    - img "SteelBird SBH-17 Full Face Helmet" [ref=e889]
                                    - button "Order now" [ref=e891]
                                - generic [ref=e892]:
                                    - generic [ref=e894]:
                                        - generic [ref=e895]: SteelBird SBH-17 Full Face Helmet
                                        - generic [ref=e896]: SteelBird SBH-17 Full Face Helmet
                                    - generic [ref=e899]:
                                        - generic [ref=e900]: 2200.00৳
                                        - generic [ref=e901]: 2700.00৳
                                    - button [ref=e904]:
                                        - img
                        - link "150 ৳ off Suomy Motorcycle Riding Gloves – GREEN Order now Suomy Motorcycle Riding Gloves – GREEN Suomy Motorcycle Riding Gloves – GREEN 900.00৳ 1050.00৳" [ref=e905] [cursor=pointer]:
                            - /url: /product-list/suomy-motorcycle-riding-gloves-green-smdwwv0b3oofxhd
                            - generic [ref=e906]:
                                - generic [ref=e907]:
                                    - generic [ref=e909]: 150 ৳ off
                                    - img "Suomy Motorcycle Riding Gloves – GREEN" [ref=e911]
                                    - button "Order now" [ref=e913]
                                - generic [ref=e914]:
                                    - generic [ref=e916]:
                                        - generic [ref=e917]: Suomy Motorcycle Riding Gloves – GREEN
                                        - generic [ref=e918]: Suomy Motorcycle Riding Gloves – GREEN
                                    - generic [ref=e921]:
                                        - generic [ref=e922]: 900.00৳
                                        - generic [ref=e923]: 1050.00৳
                                    - button [ref=e926]:
                                        - img
                        - link "10 % off CEAT Zoom Rad X1 Front Tyre Order now CEAT Zoom Rad X1 Front Tyre 2925.00৳ 3250.00৳ 5.0" [ref=e927] [cursor=pointer]:
                            - /url: /product-list/ceat-zoom-rad-x1-front-tyre-hb5swnt48k6pocv
                            - generic [ref=e928]:
                                - generic [ref=e929]:
                                    - generic [ref=e931]: 10 % off
                                    - img "CEAT Zoom Rad X1 Front Tyre" [ref=e933]
                                    - button "Order now" [ref=e935]
                                - generic [ref=e936]:
                                    - generic [ref=e939]: CEAT Zoom Rad X1 Front Tyre
                                    - generic [ref=e942]:
                                        - generic [ref=e943]: 2925.00৳
                                        - generic [ref=e944]: 3250.00৳
                                    - generic [ref=e945]:
                                        - paragraph [ref=e946]:
                                            - text: "5.0"
                                            - img [ref=e947]
                                        - button [ref=e950]:
                                            - img
                        - link "20 % off MRF Zapper C1 Rear Tyre Order now MRF Zapper C1 Rear Tyre 3080.00৳ 3850.00৳ 5.0" [ref=e951] [cursor=pointer]:
                            - /url: /product-list/mrf-zapper-c1-rear-tyre-gfhrovla6zkqbag
                            - generic [ref=e952]:
                                - generic [ref=e953]:
                                    - generic [ref=e955]: 20 % off
                                    - img "MRF Zapper C1 Rear Tyre" [ref=e957]
                                    - button "Order now" [ref=e959]
                                - generic [ref=e960]:
                                    - generic [ref=e963]: MRF Zapper C1 Rear Tyre
                                    - generic [ref=e966]:
                                        - generic [ref=e967]: 3080.00৳
                                        - generic [ref=e968]: 3850.00৳
                                    - generic [ref=e969]:
                                        - paragraph [ref=e970]:
                                            - text: "5.0"
                                            - img [ref=e971]
                                        - button [ref=e974]:
                                            - img
                        - link "200 ৳ off X2 Helmet Snow White Order now X2 Helmet Snow White 3300.00৳ 3500.00৳" [ref=e975] [cursor=pointer]:
                            - /url: /product-list/x2-helmet-snow-white-c9j842rgiu9bnji
                            - generic [ref=e976]:
                                - generic [ref=e977]:
                                    - generic [ref=e979]: 200 ৳ off
                                    - img "X2 Helmet Snow White" [ref=e981]
                                    - button "Order now" [ref=e983]
                                - generic [ref=e984]:
                                    - generic [ref=e987]: X2 Helmet Snow White
                                    - generic [ref=e990]:
                                        - generic [ref=e991]: 3300.00৳
                                        - generic [ref=e992]: 3500.00৳
                                    - button [ref=e995]:
                                        - img
                        - link "200 ৳ off Thor Sector MIPS Order now Thor Sector MIPS 11800.00৳ 12000.00৳" [ref=e996] [cursor=pointer]:
                            - /url: /product-list/thor-sector-mips-h7udh235wfbhxud
                            - generic [ref=e997]:
                                - generic [ref=e998]:
                                    - generic [ref=e1000]: 200 ৳ off
                                    - img "Thor Sector MIPS" [ref=e1002]
                                    - button "Order now" [ref=e1004]
                                - generic [ref=e1005]:
                                    - generic [ref=e1008]: Thor Sector MIPS
                                    - generic [ref=e1011]:
                                        - generic [ref=e1012]: 11800.00৳
                                        - generic [ref=e1013]: 12000.00৳
                                    - button [ref=e1016]:
                                        - img
        - generic [ref=e1019]:
            - generic [ref=e1020]:
                - img [ref=e1022]
                - generic [ref=e1024]:
                    - paragraph [ref=e1025]: Reliable Shopping
                    - paragraph [ref=e1026]: Safe and worry‑free shopping from home
            - generic [ref=e1027]:
                - img [ref=e1029]
                - generic [ref=e1031]:
                    - paragraph [ref=e1032]: Secure Payment
                    - paragraph [ref=e1033]: Payments are always safe and protected
            - generic [ref=e1034]:
                - img [ref=e1036]
                - generic [ref=e1038]:
                    - paragraph [ref=e1039]: Customer Support
                    - paragraph [ref=e1040]: 24/7 premium support, just for you
            - generic [ref=e1041]:
                - img [ref=e1043]
                - generic [ref=e1045]:
                    - paragraph [ref=e1046]: Nationwide Delivery
                    - paragraph [ref=e1047]: Fast and reliable delivery across the country
            - generic [ref=e1048]:
                - img [ref=e1050]
                - generic [ref=e1052]:
                    - paragraph [ref=e1053]: Easy Return
                    - paragraph [ref=e1054]: Hassle-Free Returns Within 14 Days
        - generic [ref=e1055]:
            - generic:
                - generic:
                    - generic: Call Us
                    - button "Call Us":
                        - img
                - generic:
                    - generic: Messenger
                    - button "Messenger":
                        - img
                - generic:
                    - generic: WhatsApp
                    - button "WhatsApp":
                        - img
            - button "Open help menu" [ref=e1056] [cursor=pointer]:
                - img [ref=e1058]
        - contentinfo [ref=e1062]:
            - generic [ref=e1063]:
                - generic [ref=e1064]:
                    - generic [ref=e1065]:
                        - generic [ref=e1066]:
                            - link "at store":
                                - /url: /
                                - img "at store" [ref=e1067] [cursor=pointer]
                        - paragraph [ref=e1068]: Your trusted marketplace for motor parts
                    - generic [ref=e1069]:
                        - paragraph [ref=e1070]: Follow us
                        - generic [ref=e1071]:
                            - button [ref=e1072] [cursor=pointer]:
                                - img
                            - button [ref=e1073] [cursor=pointer]:
                                - img
                            - button [ref=e1074] [cursor=pointer]:
                                - img
                            - button [ref=e1075] [cursor=pointer]:
                                - img
                - generic [ref=e1076]:
                    - generic [ref=e1077]:
                        - heading "CONTACTS" [level=3] [ref=e1078]
                        - list [ref=e1079]:
                            - generic [ref=e1080]:
                                - paragraph [ref=e1081]: Address
                                - paragraph [ref=e1082]: Bangshal, Dhaka, Bangladesh
                            - generic [ref=e1083]:
                                - paragraph [ref=e1084]: Phone
                                - paragraph [ref=e1085]: "01322140062"
                            - generic [ref=e1086]:
                                - paragraph [ref=e1087]: Email
                                - paragraph [ref=e1088]: contact.motolife@gmail.com
                    - generic [ref=e1089]:
                        - heading "MY ACCOUNT" [level=3] [ref=e1090]
                        - list [ref=e1091]:
                            - listitem [ref=e1092]:
                                - button "Login" [ref=e1093] [cursor=pointer]:
                                    - generic [ref=e1094]: Login
                            - listitem [ref=e1095]:
                                - link "My Orders" [ref=e1096] [cursor=pointer]:
                                    - /url: /orders
                            - listitem [ref=e1097]:
                                - link "Track Order" [ref=e1098] [cursor=pointer]:
                                    - /url: /track-order
                    - generic [ref=e1099]:
                        - heading "HELP CENTER" [level=3] [ref=e1100]
                        - list [ref=e1101]:
                            - listitem [ref=e1102]:
                                - link "Shipping & Delivery" [ref=e1103] [cursor=pointer]:
                                    - /url: /shipping-delivery
                            - listitem [ref=e1104]:
                                - link "How to Sell" [ref=e1105] [cursor=pointer]:
                                    - /url: /how-to-sell
                            - listitem [ref=e1106]:
                                - link "Contact" [ref=e1107] [cursor=pointer]:
                                    - /url: /contact-us
                - generic [ref=e1108]:
                    - generic [ref=e1109]:
                        - link "Terms & Conditions" [ref=e1111] [cursor=pointer]:
                            - /url: /terms-conditions
                        - link "Privacy Policy" [ref=e1113] [cursor=pointer]:
                            - /url: /privacy-policy
                        - link "Return & Refund Policy" [ref=e1115] [cursor=pointer]:
                            - /url: /return-refund
                    - img "payment methods" [ref=e1117]
            - generic [ref=e1119]: Copyright ©2025 MotoLife. All rights reserved
    - alert [ref=e1120]
```

# Test source

```ts
  1   | // tests/wishlist.spec.ts
  2   | import { test, expect, Page } from "@playwright/test";
  3   |
  4   | // ─── Config ───────────────────────────────────────────────────────────────────
  5   | const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
  6   | const TEST_EMAIL = process.env.TEST_EMAIL || "testuser@example.com";
  7   | const TEST_PASSWORD = process.env.TEST_PASSWORD || "testpassword";
  8   |
  9   | // ─── Helpers ──────────────────────────────────────────────────────────────────
  10  | async function login(page: Page) {
  11  |   await page.goto(`${BASE_URL}`);
> 12  |   await page.getByRole("button", { name: /login/i }).click();
      |                                                      ^ Error: locator.click: Error: strict mode violation: getByRole('button', { name: /login/i }) resolved to 2 elements:
  13  |   await page.getByPlaceholder(/email/i).fill(TEST_EMAIL);
  14  |   await page.getByPlaceholder(/password/i).fill(TEST_PASSWORD);
  15  |   await page.getByRole("button", { name: /^login$/i }).click();
  16  |   await page.waitForTimeout(1500); // wait for auth
  17  | }
  18  |
  19  | async function getZustandWishlistState(page: Page): Promise<Record<string, boolean>> {
  20  |   return page.evaluate(() => {
  21  |     // Access Zustand store from window — works if store is exposed
  22  |     const store = (window as any).__wishlistStore?.getState?.();
  23  |     return store?.wishlistedIds ?? {};
  24  |   });
  25  | }
  26  |
  27  | async function getProductCardHeartState(page: Page, nth = 0): Promise<"filled" | "empty" | "loading"> {
  28  |   const card = page.locator('[data-testid="product-card"]').nth(nth);
  29  |   const spinner = card.locator('[data-testid="wishlist-spinner"]');
  30  |   const filledHeart = card.locator('[data-testid="heart-filled"]');
  31  |   const emptyHeart = card.locator('[data-testid="heart-empty"]');
  32  |
  33  |   if (await spinner.isVisible()) return "loading";
  34  |   if (await filledHeart.isVisible()) return "filled";
  35  |   return "empty";
  36  | }
  37  |
  38  | // ─── Tests ────────────────────────────────────────────────────────────────────
  39  | test.describe("🧪 Wishlist Feature — Full QA Suite", () => {
  40  |   test.beforeEach(async ({ page }) => {
  41  |     await login(page);
  42  |     await page.goto(`${BASE_URL}/products`);
  43  |     await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
  44  |   });
  45  |
  46  |   // ── Case 1: Add to wishlist ────────────────────────────────────────────────
  47  |   test("✅ Case 1: Click heart → adds to wishlist, heart turns red", async ({ page }) => {
  48  |     const card = page.locator('[data-testid="product-card"]').first();
  49  |
  50  |     // Hover to reveal wishlist button
  51  |     await card.hover();
  52  |     const heartBtn = card.locator('[data-testid="wishlist-btn"]');
  53  |     await heartBtn.waitFor({ state: "visible" });
  54  |
  55  |     const beforeState = await getProductCardHeartState(page, 0);
  56  |     expect(beforeState).toBe("empty");
  57  |
  58  |     await heartBtn.click();
  59  |     await page.waitForTimeout(500); // optimistic update
  60  |
  61  |     const afterState = await getProductCardHeartState(page, 0);
  62  |     expect(afterState).toBe("filled");
  63  |
  64  |     // Check toast
  65  |     await expect(page.locator("text=Added to wishlist")).toBeVisible({ timeout: 3000 });
  66  |   });
  67  |
  68  |   // ── Case 2: Remove from wishlist ──────────────────────────────────────────
  69  |   test("✅ Case 2: Click red heart again → removes from wishlist", async ({ page }) => {
  70  |     const card = page.locator('[data-testid="product-card"]').first();
  71  |     await card.hover();
  72  |     const heartBtn = card.locator('[data-testid="wishlist-btn"]');
  73  |
  74  |     // Add first
  75  |     await heartBtn.click();
  76  |     await page.waitForTimeout(800);
  77  |     expect(await getProductCardHeartState(page, 0)).toBe("filled");
  78  |
  79  |     // Remove
  80  |     await heartBtn.click();
  81  |     await page.waitForTimeout(800);
  82  |     expect(await getProductCardHeartState(page, 0)).toBe("empty");
  83  |
  84  |     await expect(page.locator("text=Removed from wishlist")).toBeVisible({ timeout: 3000 });
  85  |   });
  86  |
  87  |   // ── Case 3: Same product in 2 sections syncs ──────────────────────────────
  88  |   test("✅ Case 3: Same product in 2 sections — heart syncs across both", async ({ page }) => {
  89  |     // Find a product ID that appears in multiple sections
  90  |     const allCards = page.locator('[data-testid="product-card"]');
  91  |     const firstProductId = await allCards.first().getAttribute("data-product-id");
  92  |
  93  |     // Find second instance of the same product
  94  |     const duplicateCard = page.locator(`[data-product-id="${firstProductId}"]`).nth(1);
  95  |     const firstCard = page.locator(`[data-product-id="${firstProductId}"]`).first();
  96  |
  97  |     // Click heart on first card
  98  |     await firstCard.hover();
  99  |     await firstCard.locator('[data-testid="wishlist-btn"]').click();
  100 |     await page.waitForTimeout(800);
  101 |
  102 |     // Second card should also show filled heart without clicking
  103 |     const secondCardState = await duplicateCard.locator('[data-testid="heart-filled"]').isVisible();
  104 |     expect(secondCardState).toBe(true);
  105 |
  106 |     console.log("✅ Cross-section sync works");
  107 |   });
  108 |
  109 |   // ── Case 4: Double-click protection ───────────────────────────────────────
  110 |   test("✅ Case 4: Double-click → only fires API once", async ({ page }) => {
  111 |     const apiCalls: string[] = [];
  112 |
```
