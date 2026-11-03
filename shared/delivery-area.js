/* OBSZAR DOWOZU — mapa, wyszukiwarka „czy dowozimy" i edytor w panelu.
   Wspólne dla strony głównej, /dla-punktow/ i panelu admina. Zwykły skrypt
   (bez JSX, komponenty przez React.createElement): build kopiuje go bez
   zmian. Style: shared/delivery-area.css.

   SKĄD BIORĄ SIĘ DANE
   • Panel → zakładka „Mapa dowozu" zapisuje bazę i punkty obwodu w
     ustawieniach (klucz `delivery_area`, JSON). Dopóki nic tam nie ma,
     działa lista DEFAULT poniżej.
   • Kolejność punktów nie ma znaczenia — układamy je po kącie wokół bazy,
     a obszar to gładka linia przez nie („kółko" z wcięciami).
   • Wyszukiwarka zamienia miejscowość albo kod pocztowy na współrzędne
     przez /api/geocode (OpenStreetMap) i sprawdza, czy punkt leży w obszarze.

   RIVERS i POLAND to gotowe ścieżki SVG (rzeki w oknie mapy i kontur
   Polski) z Natural Earth 1:10 mln — domena publiczna. */
(function () {
  var VIEW = {"lon0":18.35,"lon1":22.95,"lat0":53.95,"lat1":51.35,"w":1000,"h":932,"k":358.3281,"cos":0.606682};
  var INSET = {"lon0":14.1247,"lat0":54.8388,"k":32.904,"cos":0.606682,"w":200,"h":192};
  var RIVERS = 'M305 526L305 528L303 526L305 526ZM530 526L535 526L534 528L530 526ZM568 528L564 526L568 526L568 528ZM305 528L324 528L326 531L326 535L324 535L323 531L305 531L305 528ZM529 531L530 526L530 531L529 531ZM568 528L573 529L576 535L573 535L573 532L568 531L568 528ZM520 535L524 535L524 531L525 530L525 537L520 535ZM329 533L334 534L336 540L334 540L334 537L329 535L329 533ZM339 537L343 538L346 545L343 545L341 540L339 540L339 537ZM589 526L594 526L592 528L592 540L590 540L590 535L586 535L587 542L577 540L580 535L577 535L577 532L587 534L590 531L589 526ZM515 538L518 540L515 543L512 540L515 540L515 538ZM348 542L351 545L348 545L348 542ZM501 541L503 545L501 547L501 541ZM507 545L510 541L510 545L507 545ZM475 545L477 543L477 545L479 545L482 542L485 545L488 545L489 550L487 550L487 547L482 546L472 547L472 550L470 550L470 545L475 545ZM348 548L353 548L355 550L355 555L353 558L353 551L348 550L348 548ZM462 550L467 547L467 550L463 552L463 555L460 555L462 550ZM496 545L500 545L497 550L491 550L491 548L496 548L496 545ZM507 550L510 546L510 550L507 550ZM512 550L515 547L515 550L512 550ZM453 551L457 555L453 555L453 551ZM511 555L515 551L519 555L511 555ZM520 550L527 555L529 559L525 557L520 550ZM358 554L360 555L360 559L358 564L358 554ZM365 559L367 557L367 562L372 562L372 559L375 559L374 564L372 564L365 564L365 559ZM415 555L427 558L432 555L434 563L422 560L417 564L415 555ZM436 559L439 557L440 559L453 558L458 559L451 559L448 561L435 563L436 559ZM530 555L534 557L539 564L532 559L530 555ZM377 559L379 559L379 564L377 564L377 559ZM404 559L407 559L410 556L415 563L408 560L401 562L401 559L404 559ZM396 559L398 559L397 564L396 566L395 564L391 564L391 562L396 562L396 559ZM539 563L553 563L556 564L557 569L553 568L553 564L539 564L539 563ZM382 559L389 559L386 565L385 564L386 564L386 562L382 562L382 559ZM403 564L407 564L405 566L403 564ZM556 569L558 569L559 579L558 579L556 569ZM560 583L563 580L563 583L560 583ZM576 583L579 583L577 585L576 583ZM560 588L563 585L563 588L560 588ZM565 588L568 586L568 588L565 588ZM575 588L577 588L577 591L575 588ZM565 593L568 590L568 593L565 593ZM570 593L573 590L573 594L570 593ZM574 593L577 595L577 601L582 604L577 603L574 593ZM579 612L582 610L584 612L579 612ZM584 617L587 614L587 618L584 617ZM-21 622L-20 621L-18 622L-20 623L-21 622ZM12 622L14 621L15 622L12 622ZM41 622L42 621L42 624L41 622ZM589 622L592 619L592 622L589 622ZM592 617L601 627L596 624L592 617ZM26 627L28 625L30 627L26 627ZM599 632L601 629L601 633L599 632ZM604 636L606 634L606 636L604 636ZM604 641L606 639L610 641L604 641ZM606 644L611 644L616 646L616 649L611 648L609 646L606 646L606 644ZM613 651L616 651L616 654L617 656L617 661L616 661L613 651ZM74 661L76 659L76 662L74 661ZM620 659L622 661L622 668L624 674L620 673L619 670L620 670L620 659ZM618 680L620 678L622 680L618 680ZM620 682L626 685L626 694L622 699L622 694L625 692L625 688L620 685L620 682ZM624 699L627 699L627 704L625 704L624 699ZM89 704L90 703L91 704L90 706L89 704ZM628 709L630 707L635 707L636 709L639 709L639 711L628 709ZM635 714L636 714L637 719L635 722L630 723L631 719L635 719L635 714ZM626 724L632 724L630 727L626 724ZM629 728L630 733L635 734L632 734L626 738L629 728ZM85 738L90 738L85 738L85 740L85 738ZM630 743L635 740L637 743L639 743L639 745L630 743ZM635 753L639 750L642 753L640 758L639 753L635 753ZM644 757L649 756L651 758L653 762L644 757ZM654 760L659 760L659 764L654 762L654 760ZM662 762L663 761L663 768L661 767L662 762ZM625 771L625 773L621 772L625 772L625 771ZM666 767L668 765L672 786L668 785L665 782L668 782L668 774L666 772L666 767ZM606 785L608 787L606 787L606 785ZM666 787L668 787L668 792L666 792L666 787ZM601 788L602 792L598 792L601 792L601 788ZM61 794L64 797L61 798L61 794ZM665 797L668 793L672 793L668 805L668 797L665 797ZM595 797L598 797L596 798L595 797ZM673 800L678 801L678 803L673 803L673 800ZM589 801L592 801L592 803L589 801ZM675 806L678 806L678 814L679 816L677 816L675 806ZM414 811L416 811L415 813L412 814L414 811ZM403 816L405 815L406 816L403 816ZM573 812L573 817L570 816L573 816L573 812ZM687 816L691 816L687 820L687 816ZM566 821L568 820L570 821L568 822L566 821ZM677 821L686 816L686 821L677 821ZM692 817L695 821L692 821L692 817ZM75 826L76 824L76 826L78 826L75 826ZM693 821L700 826L699 831L697 833L697 826L694 826L693 821ZM702 830L704 836L702 836L702 830ZM504 836L506 834L506 837L504 836ZM522 836L525 834L525 836L522 836ZM706 836L711 833L713 836L713 841L711 841L711 839L706 836ZM471 841L472 839L474 841L471 841ZM716 838L721 841L721 842L716 842L716 838ZM853 841L856 841L854 842L853 841ZM442 845L445 845L444 847L442 845ZM840 844L841 845L840 847L839 845L840 844ZM717 850L721 846L721 850L717 850ZM723 850L725 847L725 855L723 850ZM830 850L834 850L831 850L831 852L830 850ZM434 847L435 850L431 850L434 850L434 847ZM726 850L730 850L730 854L735 853L736 855L741 855L745 853L754 854L756 855L758 860L754 858L753 855L737 857L730 856L726 850ZM804 850L808 850L807 852L804 850ZM788 853L789 855L788 857L788 853ZM819 855L821 854L822 855L819 855ZM757 860L760 860L759 865L757 865L757 860ZM107 865L109 864L110 865L109 867L109 865L107 865ZM380 865L382 864L383 865L380 865ZM755 870L759 867L761 870L761 885L759 889L759 870L755 870ZM764 885L767 885L764 888L764 885ZM768 889L773 887L775 889L774 894L773 895L773 889L768 889ZM778 894L780 894L778 899L778 894ZM780 904L783 901L783 907L780 904ZM780 914L783 911L783 914L780 914ZM781 919L783 916L786 919L781 919ZM784 919L792 928L788 926L784 919ZM786 934L788 931L792 934L786 934ZM783 937L788 939L778 940L783 937ZM773 940L776 944L773 945L773 940ZM767 948L768 945L773 944L768 950L764 950L762 948L767 948ZM907 528L905 526L907 526L907 528ZM907 528L908 531L907 535L907 528ZM912 531L914 531L912 533L912 531ZM911 535L914 535L912 537L911 535ZM920 555L921 553L921 555L923 555L921 556L920 555ZM926 556L928 559L926 560L926 556ZM934 559L936 558L937 559L936 561L934 559ZM943 559L945 557L945 559L943 559ZM948 559L950 558L950 561L948 559ZM952 559L957 559L955 562L952 559ZM959 563L961 564L959 567L959 563ZM967 564L969 564L969 566L967 564ZM991 564L993 564L993 566L991 564ZM996 564L1000 564L998 566L996 564ZM972 569L974 567L974 569L972 569ZM977 569L979 568L979 571L977 569ZM982 569L983 567L985 569L982 569ZM1005 574L1007 572L1007 575L1005 574ZM1010 579L1012 577L1013 579L1012 580L1010 579ZM1019 583L1022 581L1022 583L1019 583ZM138 -23L139 -21L138 -19L135 -21L138 -21L138 -23ZM104 -19L107 -16L104 -16L104 -19ZM130 -16L135 -16L133 -14L130 -16ZM106 -11L109 -15L109 -11L106 -11ZM27 -7L28 -9L30 -7L27 -7ZM110 -7L114 -10L114 -7L110 -7ZM123 -7L124 -8L125 -7L124 -5L123 -7ZM111 -2L114 -5L114 -2L111 -2ZM119 -7L119 -2L116 -2L119 -2L119 -7ZM109 -1L113 2L109 2L109 -1ZM109 4L113 7L109 7L109 4ZM109 10L114 10L116 12L115 16L109 10ZM115 21L119 17L119 21L115 21ZM114 24L119 24L119 26L114 28L111 26L114 26L114 24ZM109 30L114 30L114 32L109 32L109 30ZM107 35L112 35L109 38L107 35ZM453 40L454 44L453 47L453 40ZM104 41L108 44L104 48L104 41ZM105 50L109 51L109 57L105 50ZM104 59L108 63L104 63L104 59ZM106 67L109 64L109 67L106 67ZM106 72L109 70L111 72L109 78L104 78L104 77L109 76L109 72L106 72ZM103 81L106 81L104 86L103 86L103 81ZM95 85L98 86L95 89L95 85ZM91 91L95 91L95 94L91 91ZM90 100L90 97L95 97L92 100L85 103L85 100L90 100ZM82 105L88 105L85 107L82 105ZM81 111L85 112L87 119L85 119L85 115L82 114L81 111ZM86 123L90 120L90 123L86 123ZM85 127L90 126L91 128L85 127ZM87 133L90 130L92 133L87 137L87 133ZM85 139L90 140L91 142L87 147L85 139ZM86 151L90 148L90 155L86 151ZM85 156L87 156L86 166L82 170L82 166L85 165L85 156ZM79 170L84 170L81 173L79 170ZM73 180L81 178L81 180L76 180L76 183L71 183L73 180ZM52 184L56 184L52 188L52 184ZM66 183L69 184L66 188L62 184L66 184L66 183ZM42 187L45 189L42 193L42 187ZM47 185L51 189L47 189L47 185ZM58 189L61 185L61 189L58 189ZM33 189L37 189L33 193L33 189ZM28 193L32 189L31 194L23 198L28 193ZM38 190L41 194L38 194L38 190ZM21 203L27 198L27 203L23 203L23 208L22 208L21 203ZM14 206L16 208L14 208L14 206ZM6 212L9 211L18 211L18 212L9 212L9 216L4 216L6 212ZM2 217L4 215L4 217L2 217ZM-3 222L4 220L4 222L-1 222L-1 225L-5 226L-3 222ZM-5 227L-4 231L-9 235L-8 231L-5 230L-5 227ZM-9 236L-5 236L-5 240L-9 236ZM-10 241L-8 241L-9 245L-15 248L-15 245L-10 244L-10 241ZM-20 250L-17 255L-20 255L-20 250ZM777 255L778 253L780 255L777 255ZM800 260L802 258L803 260L800 260ZM807 259L808 260L807 262L807 259ZM807 269L812 269L811 272L811 269L807 269ZM745 269L747 269L745 271L745 269ZM735 275L736 278L735 279L735 275ZM729 278L732 278L730 280L729 278ZM874 282L875 283L874 284L874 282ZM725 286L727 288L725 289L725 286ZM859 293L859 291L861 293L859 294L859 293ZM721 295L723 297L721 297L721 295ZM853 297L854 295L856 297L853 297ZM710 297L714 297L711 299L710 297ZM704 302L707 302L706 303L704 302ZM-19 311L-15 308L-15 311L-19 311ZM-13 311L-10 309L-10 314L-13 311ZM-8 311L-5 311L-5 316L-2 316L-1 319L-5 318L-8 311ZM697 307L698 311L693 311L697 311L697 307ZM-1 319L4 321L7 326L4 326L4 323L-1 321L-1 319ZM692 319L694 321L692 322L692 319ZM11 326L14 323L14 328L11 326ZM17 326L18 326L18 333L17 330L17 326ZM686 330L687 329L689 330L687 332L686 330ZM20 330L23 330L25 335L33 335L33 337L23 336L20 330ZM34 335L41 335L38 339L34 335ZM46 335L47 341L45 340L46 335ZM61 334L64 335L61 338L57 335L61 335L61 334ZM49 340L52 337L57 337L49 344L49 340ZM68 340L71 337L74 340L68 340ZM685 340L687 339L688 340L687 341L685 340ZM72 345L76 341L76 345L72 345ZM74 349L76 347L77 349L76 354L81 354L81 355L76 355L76 349L74 349ZM681 349L682 348L684 349L682 351L681 349ZM79 359L81 359L81 363L84 364L85 367L81 365L79 359ZM678 356L678 360L674 359L678 359L678 356ZM672 364L673 360L672 364ZM88 368L90 368L90 372L95 371L98 373L99 378L95 376L93 373L88 373L88 368ZM663 370L665 373L663 375L663 370ZM100 378L100 375L104 377L107 383L104 383L103 378L100 378ZM104 385L111 387L111 392L109 392L108 387L104 387L104 385ZM666 387L668 385L668 388L666 387ZM114 390L119 391L124 398L119 398L119 393L114 392L114 390ZM670 392L673 389L673 394L670 392ZM673 397L676 397L673 398L673 397ZM122 402L124 402L125 411L128 411L128 413L124 413L124 409L121 406L122 402ZM675 406L678 405L679 406L675 406ZM648 416L650 416L649 420L649 416L648 416ZM657 416L659 415L659 418L657 416ZM663 416L665 416L663 416L663 420L663 416ZM124 421L128 417L131 421L124 421ZM608 421L616 421L608 421ZM635 419L636 421L635 422L635 419ZM642 421L644 419L646 421L642 421ZM672 421L673 420L677 421L673 421L673 422L672 421ZM628 421L632 421L630 423L628 421ZM128 422L133 424L133 428L138 430L138 432L133 432L131 430L132 425L128 425L128 422ZM604 425L606 424L608 425L604 425ZM620 424L622 425L620 427L620 424ZM614 425L618 425L616 427L614 425ZM601 428L603 430L601 431L601 428ZM596 435L598 435L601 439L596 435ZM596 440L599 440L596 441L596 440ZM137 435L140 440L140 444L138 446L137 435ZM143 444L147 444L147 446L143 446L143 444ZM599 444L601 444L601 447L599 444ZM594 449L596 448L596 451L594 449ZM762 449L765 449L764 451L762 449ZM772 449L773 447L773 449L777 449L773 450L772 449ZM145 449L147 449L149 454L149 459L147 460L147 454L145 449ZM754 454L754 453L758 454L754 454ZM781 454L783 453L784 454L783 456L781 454ZM594 454L596 454L596 457L594 454ZM745 456L746 459L745 460L745 456ZM749 456L752 459L749 459L749 456ZM152 457L154 459L154 464L152 464L152 457ZM157 462L162 462L162 464L157 464L157 462ZM594 464L596 461L596 464L594 464ZM738 464L740 461L742 464L738 464ZM595 468L596 467L598 468L596 472L596 468L595 468ZM732 468L735 467L736 468L732 468ZM725 473L725 472L728 473L725 473ZM730 470L733 473L730 473L730 470ZM700 478L702 476L702 481L700 478ZM704 478L706 476L706 480L704 478ZM709 478L713 478L714 482L709 478ZM716 477L717 478L716 480L716 477ZM721 475L723 478L721 478L721 475ZM696 483L697 479L697 483L702 483L696 483ZM687 480L689 483L687 484L684 483L687 483L687 480ZM678 485L680 487L678 487L678 485ZM597 478L601 476L603 478L602 485L605 492L599 487L601 487L601 478L597 478ZM673 486L674 487L673 489L672 487L673 486ZM595 496L601 493L599 497L592 502L595 496ZM162 459L169 462L174 460L181 461L186 467L186 464L187 464L190 466L201 468L205 471L224 471L229 473L238 478L253 491L257 490L262 492L262 494L267 494L270 497L274 497L274 502L272 502L272 499L261 497L257 494L248 492L248 490L238 485L234 487L235 483L233 481L229 481L225 478L219 479L200 477L195 475L195 471L190 471L189 468L181 468L176 465L163 464L162 459ZM668 492L668 502L668 492ZM276 500L281 499L284 502L283 507L281 507L281 503L276 502L276 500ZM592 502L596 502L596 504L592 503L592 502ZM900 502L902 502L902 505L900 502ZM286 503L292 507L294 511L291 511L291 508L286 507L286 503ZM659 504L661 507L659 507L659 504ZM620 507L620 512L620 507ZM622 507L625 507L625 510L622 507ZM627 507L632 507L630 509L627 507ZM635 507L637 507L635 509L635 507ZM642 507L646 507L644 509L642 507ZM654 502L654 507L649 507L654 507L654 502ZM297 511L300 508L300 513L297 511ZM613 511L616 509L616 514L613 511ZM709 511L712 511L711 514L711 511L709 511ZM596 511L598 516L596 518L596 511ZM603 511L606 511L606 514L603 511ZM608 511L611 511L611 514L608 511ZM305 526L302 521L305 517L303 516L303 511L305 511L305 515L307 516L305 526ZM592 523L592 507L594 507L595 521L592 523ZM537 526L539 523L542 526L537 526ZM546 526L549 523L549 526L546 526ZM550 526L553 523L555 526L550 526ZM559 526L563 522L566 526L559 526ZM592 523L592 526L588 526L592 523ZM735 523L737 526L735 526L735 523ZM1006 40L1007 38L1010 40L1006 40ZM905 208L902 211L902 208L905 208ZM989 264L993 264L993 267L993 264L989 264ZM1001 364L1002 362L1002 364L1001 364ZM904 511L907 510L907 511L904 511ZM905 516L907 514L908 516L907 518L905 516ZM903 526L907 524L907 526L903 526Z';
  var POLAND = 'M94 175.5L93 170.5L93 170L92 170L89.5 168.5L88.5 165.5L89 164L88.5 164L88.5 162.5L87 162.5L84.5 161.5L83 162L82.5 161L79.5 159.5L79 158.5L77.5 157.5L78 159L74 160L72.5 158.5L72 156.5L72 156L70 155.5L69 154L71 153.5L72.5 152L71.5 151L72 149.5L71.5 149L70 150.5L67 150.5L66 151.5L65 150L64.5 151L63.5 149L64 149L61.5 148L61 146.5L60 147L55.5 145L54.5 146L56 148.5L57 150L57.5 152L56.5 151.5L56.5 152L54 153L51.5 156L50.5 156L48.5 154.5L48 152.5L46 149.5L45 148.5L44.5 147L42.5 147L42 146L41.5 146L41.5 144.5L43 143L44.5 143L45.5 142L45.5 141L46 140.5L44 138L42 137.5L41 138.5L39 138L37 139.5L37.5 138.5L37 137L36.5 136.5L34.5 137L33.5 135L31 135L30.5 134.5L26.5 133L24.5 133.5L24.5 132L23 131L22.5 129.5L23 128L22 127L21 127L20.5 126L19.5 127L17.5 125.5L16.5 126.5L17.5 127.5L17 131L13.5 131L16.5 124L18 117.5L16.5 115.5L16.5 111.5L11.5 109L12.5 106.5L12 104.5L10.5 102.5L10 101L9 100L9.5 98.5L11 96.5L11.5 93.5L12.5 91L11 89.5L11.5 85.5L9 84L8.5 81L8.5 79.5L10 77L9.5 76.5L10.5 74.5L6 71L5 69L0 65.5L1 64L0.5 62L4.5 59L5.5 56L5 54.5L6.5 52L5.5 51.5L4.5 46L3.5 44L3 37.5L3.5 37L3.5 36L5.5 38L8 39L9.5 41L10 39L9 39L8.5 37.5L9 35L10 35L10 32.5L9 34L9 32.5L6.5 32L6 30.5L4.5 31.5L5.5 32L6 32.5L4 33L4 33.5L3 33L1 30.5L1.5 29.5L3 30L5.5 30L13 26.5L31 21L34.5 19.5L40 18.5L39 19L41 19L41 18.5L42 18.5L42 17.5L40 18L43 16L42 17L44 16L44 15.5L43 16L44 14.5L46 11.5L46.5 12L47 11.5L47 11L46.5 11.5L46.5 10.5L49 9.5L56 7.5L58 5.5L64 3L75 0.5L80.5 0L84 0L92.5 5L93.5 6.5L93.5 8L91.5 4.5L86.5 1.5L86 1.5L85.5 3.5L87 5L87 7L88 6.5L89 13.5L91 14.5L91.5 15L95 16L96.5 16L97.5 16L105 15L108 14L109.5 12.5L112.5 13.5L171 16.5L172.5 16L174 14.5L176.5 15L177 16L178 16.5L178 18L179.5 17.5L183.5 20L186 22.5L187 26L186.5 28L187 29L189 40.5L193 52.5L195 55.5L194.5 58.5L195.5 60L195.5 70.5L192 73L188.5 74L185 76.5L180.5 84L181 84.5L181 85.5L185 87L185 87.5L187 87.5L187.5 89.5L188.5 89.5L190 90.5L190.5 93.5L189.5 95L189 98.5L189.5 99.5L188.5 101.5L188.5 104L188 104.5L188.5 108L189 109L189.5 110L190.5 110.5L190 111L191 113L190 115L190 116.5L191 116.5L192.5 120L194.5 121.5L195.5 126L196.5 127L196.5 128.5L200 131L199.5 131.5L197 131.5L196.5 132.5L196.5 133.5L197.5 134L197.5 135L199 135.5L199.5 138.5L199 139.5L199.5 141.5L197.5 143L197 146L191 147L190 149L179 160.5L173.5 169L172.5 170L170.5 173.5L170 174.5L171 178.5L171.5 180L172 183L171 187L171.5 186.5L174.5 189.5L174.5 192.5L172.5 190.5L170 190.5L168.5 189.5L168 189.5L165 189L164 188L161.5 187.5L161 186.5L158 185.5L157.5 185L157 183L156 181L153.5 179.5L152.5 180.5L151 179L149.5 178L146 178.5L142.5 177.5L141 179L139.5 178L138.5 178.5L138 179L138.5 180.5L137.5 180.5L135.5 182.5L133 181L131 179L129.5 179L128 180L126 179L125.5 179.5L123.5 179L123 181L121.5 181L120 182L118.5 186.5L116 184.5L114 186L112.5 185.5L112.5 185L113.5 183L113 182.5L112.5 179L110 179L110 177.5L108.5 177L107.5 173.5L106.5 172.5L104 174.5L102 175.5L101.5 177.5L100 179L98.5 178.5L96.5 179.5L96.5 176L94 175.5Z';

  var DEFAULT = {
    center: { name: 'Płońsk', postal: '09-100', lat: 52.6236, lon: 20.3753 },
    towns: [
      { name: 'Łódź',            lat: 51.7592, lon: 19.4560, label: 'l' },
      { name: 'Włocławek',       lat: 52.6483, lon: 19.0677, label: 'l' },
      { name: 'Lipno',           lat: 52.8445, lon: 19.1781, label: 'l' },
      { name: 'Rypin',           lat: 53.0656, lon: 19.4092, label: 'l' },
      { name: 'Lidzbark',        lat: 53.2675, lon: 19.8231, label: 't' },
      { name: 'Nidzica',         lat: 53.3611, lon: 20.4275, label: 't' },
      { name: 'Szczytno',        lat: 53.5628, lon: 20.9853, label: 't' },
      { name: 'Myszyniec',       lat: 53.3814, lon: 21.3475, label: 'r' },
      { name: 'Łomża',           lat: 53.1781, lon: 22.0592, label: 'r' },
      { name: 'Zambrów',         lat: 52.9856, lon: 22.2431, label: 'r' },
      { name: 'Małkinia',        lat: 52.6911, lon: 22.0275, label: 'r' },
      { name: 'Łochów',          lat: 52.5300, lon: 21.6833, label: 'r' },
      { name: 'Radzymin',        lat: 52.4150, lon: 21.1844, label: 'r' },
      { name: 'Marki',           lat: 52.3264, lon: 21.1050, label: 'r' },
      { name: 'Łomianki',        lat: 52.3336, lon: 20.8853, label: 'l' },
      { name: 'Żyrardów',        lat: 52.0489, lon: 20.4458, label: 'r' },
      { name: 'Rawa Mazowiecka', lat: 51.7642, lon: 20.2522, label: 'r' },
    ],
  };
  /* Miasta orientacyjne (szare kwadraty) — żeby było widać, co leży w
     obszarze i wokół niego. Same w sobie nie oznaczają dowozu (o tym mówi
     obszar). major — podpis zostaje też na telefonie. */
  var REF = [
    { name: 'Warszawa',       lat: 52.2297, lon: 21.0122, label: 'r', major: true },
    { name: 'Płock',          lat: 52.5468, lon: 19.7064, label: 'b', major: true },
    { name: 'Ciechanów',      lat: 52.8813, lon: 20.6200, label: 'r', major: true },
    { name: 'Ostrołęka',      lat: 53.0842, lon: 21.5749, label: 'r', major: true },
    { name: 'Kutno',          lat: 52.2306, lon: 19.3646, label: 'r', major: true },
    { name: 'Toruń',          lat: 53.0138, lon: 18.5984, label: 'r', major: true },
    { name: 'Mława',          lat: 53.1123, lon: 20.3843, label: 'r' },
    { name: 'Działdowo',      lat: 53.2366, lon: 20.1782, label: 'r' },
    { name: 'Przasnysz',      lat: 53.0190, lon: 20.8800, label: 'r' },
    { name: 'Pułtusk',        lat: 52.7027, lon: 21.0827, label: 'r' },
    { name: 'Wyszków',        lat: 52.5939, lon: 21.4580, label: 'l' },
    { name: 'Ostrów Maz.',    lat: 52.8022, lon: 21.8956, label: 'l' },
    { name: 'Sierpc',         lat: 52.8570, lon: 19.6690, label: 'r' },
    { name: 'Nowy Dwór Maz.', lat: 52.4300, lon: 20.7170, label: 'l' },
    { name: 'Sochaczew',      lat: 52.2294, lon: 20.2385, label: 'r' },
    { name: 'Łowicz',         lat: 52.1070, lon: 19.9440, label: 'r' },
    { name: 'Skierniewice',   lat: 51.9547, lon: 20.1580, label: 'r' },
  ];

  /* Główne drogi — SCHEMATYCZNIE: linia przez kolejne miejscowości na
     trasie, nie dokładny przebieg. Wystarczy, żeby było widać, którędy
     jedzie się z bazy. kind: 'a' autostrada/ekspresowa, 'dk' krajowa;
     at — gdzie stoi tabliczka z numerem (bez at = bez tabliczki). */
  var ROADS = [
    { ref: 'S7', kind: 'a', at: [52.98, 20.35], pts: [[53.59, 20.29], [53.36, 20.43], [53.10, 20.42], [52.90, 20.29], [52.62, 20.40], [52.51, 20.53], [52.38, 20.70], [52.31, 20.86], [52.22, 20.95], [52.05, 20.88], [51.87, 20.87]] },
    { ref: 'S8', kind: 'a', at: [52.70, 21.68], pts: [[52.32, 21.10], [52.42, 21.20], [52.58, 21.45], [52.79, 21.90], [52.98, 22.25], [53.07, 22.60], [53.12, 22.95]] },
    { ref: 'S8', kind: 'a', pts: [[52.17, 20.92], [51.97, 20.52], [51.77, 20.26], [51.53, 20.00], [51.40, 19.70]] },
    { ref: 'A1', kind: 'a', at: [51.72, 19.59], pts: [[53.03, 18.60], [52.62, 19.03], [52.52, 19.15], [52.25, 19.30], [52.07, 19.47], [51.92, 19.58], [51.78, 19.60], [51.60, 19.55], [51.42, 19.70]] },
    { ref: 'A2', kind: 'a', at: [52.17, 21.85], pts: [[52.19, 18.40], [52.09, 18.82], [52.04, 19.18], [51.92, 19.58], [52.06, 19.93], [52.08, 20.35], [52.13, 20.62], [52.20, 20.86], [52.17, 21.10], [52.18, 21.55], [52.15, 22.25], [52.10, 22.95]] },
    { ref: 'S61', kind: 'a', at: [53.40, 22.16], pts: [[52.79, 21.90], [53.15, 22.05], [53.38, 22.15], [53.56, 22.29], [53.85, 22.36]] },
    { ref: '10', kind: 'dk', at: [52.85, 19.42], pts: [[52.62, 20.38], [52.74, 19.99], [52.86, 19.67], [52.84, 19.18], [53.01, 18.60]] },
    { ref: '60', kind: 'dk', at: [52.85, 21.65], pts: [[52.23, 19.36], [52.43, 19.46], [52.55, 19.70], [52.74, 19.99], [52.78, 20.11], [52.88, 20.62], [52.88, 21.40], [52.80, 21.89]] },
    { ref: '50', kind: 'dk', at: [52.31, 20.21], pts: [[52.88, 20.62], [52.62, 20.38], [52.39, 20.19], [52.23, 20.24], [52.05, 20.45], [51.97, 20.52]] },
    { ref: '61', kind: 'dk', at: [52.79, 21.24], pts: [[52.40, 20.93], [52.51, 21.06], [52.70, 21.08], [52.88, 21.40], [53.08, 21.57], [53.18, 22.06]] },
    { ref: '62', kind: 'dk', pts: [[52.55, 19.70], [52.39, 20.19], [52.43, 20.61], [52.43, 20.72], [52.51, 21.06], [52.59, 21.46]] },
    { ref: '92', kind: 'dk', at: [52.21, 20.75], pts: [[52.23, 19.36], [52.11, 19.94], [52.23, 20.24], [52.20, 20.62], [52.22, 20.90]] },
  ];
  var EDGE_KM = 8;          // tyle km od granicy mówimy „na skraju obszaru"
  var LABELS = ['r', 'l', 't', 'b'];

  /* ---------- geometria ---------- */
  var KM = VIEW.k / 111.2;  // jednostek mapy na 1 km
  function project(lat, lon) { return [(lon - VIEW.lon0) * VIEW.cos * VIEW.k, (VIEW.lat0 - lat) * VIEW.k]; }
  function unproject(x, y) { return [VIEW.lat0 - y / VIEW.k, VIEW.lon0 + x / (VIEW.cos * VIEW.k)]; }
  function projectInset(lat, lon) { return [(lon - INSET.lon0) * INSET.cos * INSET.k, (INSET.lat0 - lat) * INSET.k]; }
  function rad(d) { return d * Math.PI / 180; }
  function km(a, b) {       // odległość w linii prostej (haversine)
    var dl = rad(b.lat - a.lat), dn = rad(b.lon - a.lon);
    var s = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dn / 2) * Math.sin(dn / 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }
  function angle(c, t) {    // kąt na mapie: 0 = wschód, 90 = południe
    var p = project(t.lat, t.lon), q = project(c.lat, c.lon);
    return Math.atan2(p[1] - q[1], p[0] - q[0]) * 180 / Math.PI;
  }
  function autoLabel(c, t) {
    var a = angle(c, t);
    if (a < -55 && a > -125) return 't';
    if (a > 55 && a < 125) return 'b';
    return Math.abs(a) <= 90 ? 'r' : 'l';
  }
  // Odcinki krzywej Catmulla–Roma przez zamkniętą listę punktów
  function segments(pts) {
    var n = pts.length, out = [];
    for (var i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      out.push([p1, [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6], p2]);
    }
    return out;
  }
  function smoothPath(pts) {
    if (pts.length < 3) return '';
    var f = function (v) { return v.toFixed(1); };
    return 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]) + segments(pts).map(function (s) {
      return 'C' + [s[1][0], s[1][1], s[2][0], s[2][1], s[3][0], s[3][1]].map(f).join(' ');
    }).join('') + 'Z';
  }
  // Otwarta, gładka linia przez punkty (drogi)
  function openPath(pts) {
    if (pts.length < 2) return '';
    var f = function (v) { return v.toFixed(1); };
    var P = [pts[0]].concat(pts, [pts[pts.length - 1]]), d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]);
    for (var i = 1; i < P.length - 2; i++) {
      var p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2];
      d += 'C' + [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]].map(f).join(' ');
    }
    return d;
  }
  var roadCache = null;
  function roads() {
    if (!roadCache) roadCache = ROADS.map(function (r) {
      return { ref: r.ref, kind: r.kind, d: openPath(r.pts.map(function (q) { return project(q[0], q[1]); })), at: r.at ? project(r.at[0], r.at[1]) : null };
    });
    return roadCache;
  }

  // Ta sama krzywa jako wielokąt (do sprawdzania „czy w środku")
  function sample(pts) {
    var out = [];
    segments(pts).forEach(function (s) {
      for (var j = 0; j < 12; j++) {
        var t = j / 12, u = 1 - t;
        out.push([
          u * u * u * s[0][0] + 3 * u * u * t * s[1][0] + 3 * u * t * t * s[2][0] + t * t * t * s[3][0],
          u * u * u * s[0][1] + 3 * u * u * t * s[1][1] + 3 * u * t * t * s[2][1] + t * t * t * s[3][1],
        ]);
      }
    });
    return out;
  }

  /* ---------- dane z ustawień ---------- */
  function num(v) { var n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : null; }
  function cleanPoint(t) {
    if (!t) return null;
    var lat = num(t.lat), lon = num(t.lon), name = String(t.name || '').trim();
    if (lat === null || lon === null || !name || lat < 48 || lat > 56 || lon < 13 || lon > 25) return null;
    var p = { name: name, lat: lat, lon: lon };
    if (t.postal) p.postal = String(t.postal).trim();
    if (LABELS.indexOf(t.label) !== -1) p.label = t.label;
    return p;
  }
  /* Obszar z wartości ustawienia `delivery_area`. Zła albo pusta wartość =
     DEFAULT. Punkty układamy po kącie wokół bazy. */
  function resolve(value) {
    var v = null;
    try { v = typeof value === 'string' && value.trim() ? JSON.parse(value) : (value && typeof value === 'object' ? value : null); } catch (e) { v = null; }
    var center = (v && cleanPoint(v.center)) || null;
    var towns = v && Array.isArray(v.towns) ? v.towns.map(cleanPoint).filter(Boolean) : [];
    var custom = !!(center && towns.length >= 3);
    if (!custom) { center = DEFAULT.center; towns = DEFAULT.towns.map(cleanPoint); }
    towns = towns.slice().sort(function (a, b) { return angle(center, a) - angle(center, b); });
    towns.forEach(function (t) { t.auto = !t.label; if (!t.label) t.label = autoLabel(center, t); t.km = km(center, t); });
    var pts = towns.map(function (t) { return project(t.lat, t.lon); });
    return { center: center, towns: towns, refs: REF, custom: custom, path: smoothPath(pts), poly: sample(pts),
             insetPath: smoothPath(towns.map(function (t) { return projectInset(t.lat, t.lon); })) };
  }
  /* Czy punkt leży w obszarze. inside — w środku, edgeKm — odległość od
     granicy, distKm — od bazy (w linii prostej). */
  function check(area, lat, lon) {
    var p = project(lat, lon), poly = area.poly, inside = false, best = Infinity;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var a = poly[i], b = poly[j];
      if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
      var dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
      var t = L ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L)) : 0;
      best = Math.min(best, Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy));
    }
    var edgeKm = best / KM;
    return { inside: inside, edgeKm: edgeKm, distKm: km(area.center, { lat: lat, lon: lon }),
             verdict: edgeKm <= EDGE_KM ? 'edge' : inside ? 'in' : 'out' };
  }
  // Kadr mapy: obszar z podpisami i marginesem, proporcje 0,8–1,3
  function frame(area) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    function add(x, y) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    var c = project(area.center.lat, area.center.lon);
    add(c[0] - 20, c[1] - 30); add(c[0] + 30 + area.center.name.length * 15, c[1] + 20);
    area.towns.forEach(function (t) {
      var q = project(t.lat, t.lon), w = t.name.length * 10.5 + 16;
      add(q[0], q[1]);
      if (t.label === 'l') add(q[0] - w, q[1]);
      else if (t.label === 'r') add(q[0] + w, q[1]);
      else { add(q[0] - w / 2, q[1] + (t.label === 't' ? -36 : 36)); add(q[0] + w / 2, q[1]); }
    });
    var pad = 34; x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
    var w = x1 - x0, h = y1 - y0;
    if (h < w * 0.8) { y0 -= (w * 0.8 - h) / 2; h = w * 0.8; }
    if (w < h / 1.3) { x0 -= (h / 1.3 - w) / 2; w = h / 1.3; }
    return [x0, y0, w, h].map(function (v) { return Math.round(v); });
  }

  /* ---------- komponenty (React.createElement) ---------- */
  function h() { return window.React.createElement.apply(null, arguments); }
  function labelPos(pos, xy, gap) {
    gap = gap || 12;
    if (pos === 'l') return { x: xy[0] - gap, y: xy[1] + 6, a: 'end' };
    if (pos === 't') return { x: xy[0], y: xy[1] - gap - 4, a: 'middle' };
    if (pos === 'b') return { x: xy[0], y: xy[1] + gap + 18, a: 'middle' };
    return { x: xy[0] + gap, y: xy[1] + 6, a: 'start' };
  }

  /* Mapa. props: area (z resolve), hl (nazwa podświetlonego miasta),
     onHover(nazwa|null), pin ({ name, lat, lon, verdict }), onMapClick(lat, lon)
     — w panelu klik dodaje punkt. */
  function MapView(p) {
    var area = p.area, fr = frame(area), c = project(area.center.lat, area.center.lon), R = 100 * KM;
    var ring = [c[0] - R * Math.cos(0.35), c[1] + R * Math.sin(0.35) + 26];
    var kids = [
      h('rect', { key: 'bg', className: 'dm-bg', x: fr[0] - 400, y: fr[1] - 400, width: fr[2] + 800, height: fr[3] + 800 }),
      h('path', { key: 'rv', className: 'dm-river', d: RIVERS }),
      h('g', { key: 'rd', className: 'dm-roads' }, roads().map(function (r, i) {
        return h('path', { key: i, className: 'dm-road dm-road-' + r.kind, d: r.d });
      })),
      h('circle', { key: 'rg', className: 'dm-ring', cx: c[0], cy: c[1], r: R }),
      h('text', { key: 'rt', className: 'dm-ring-t', x: ring[0], y: ring[1], textAnchor: 'middle' }, '100 km'),
      h('path', { key: 'ar', className: 'dm-area', d: area.path }),
    ];
    roads().forEach(function (r, i) {
      if (!r.at) return;
      var w = 12 + r.ref.length * 9.5;
      kids.push(h('g', { key: 'sh' + i, className: 'dm-shield dm-shield-' + r.kind },
        h('rect', { x: r.at[0] - w / 2, y: r.at[1] - 10, width: w, height: 20, rx: 4 }),
        h('text', { x: r.at[0], y: r.at[1] + 5, textAnchor: 'middle' }, r.ref)));
    });
    // Szukane miejsce ma już podpis na mapie? Wtedy pinezka nie dubluje nazwy.
    var near = function (o) { return p.pin && km(p.pin, o) < 6; };
    var pinNamed = p.pin && (area.towns.some(near) || area.refs.some(near));
    area.refs.forEach(function (r) {
      var xy = project(r.lat, r.lon), L = labelPos(r.label, xy, 10);
      kids.push(h('g', { key: 'r' + r.name, className: 'dm-ref' + (r.major ? ' dm-ref-major' : '') },
        h('rect', { x: xy[0] - 5, y: xy[1] - 5, width: 10, height: 10, rx: 2 }),
        h('text', { x: L.x, y: L.y, textAnchor: L.a }, r.name)));
    });
    area.towns.forEach(function (t) {
      var xy = project(t.lat, t.lon), L = labelPos(t.label, xy), on = p.hl === t.name;
      kids.push(h('g', {
        key: 't' + t.name + t.lat, className: 'dm-town' + (on ? ' on' : ''),
        onMouseEnter: p.onHover ? function () { p.onHover(t.name); } : undefined,
        onMouseLeave: p.onHover ? function () { p.onHover(null); } : undefined,
      },
        h('circle', { cx: xy[0], cy: xy[1], r: on ? 10 : 7 }),
        h('text', { x: L.x, y: L.y, textAnchor: L.a }, t.name)));
    });
    kids.push(
      h('circle', { key: 'cp', className: 'dm-pulse', cx: c[0], cy: c[1], r: 13 }),
      h('circle', { key: 'cc', className: 'dm-c', cx: c[0], cy: c[1], r: 13 }),
      h('text', { key: 'ct', className: 'dm-c-t', x: c[0] + 22, y: c[1] + 9 }, area.center.name));
    if (p.pin) {
      var q = project(p.pin.lat, p.pin.lon);
      // Pinezka tylko, gdy miejsce mieści się w kadrze — inaczej wystarczy odpowiedź tekstem
      if (q[0] > fr[0] && q[0] < fr[0] + fr[2] && q[1] > fr[1] && q[1] < fr[1] + fr[3]) {
        kids.push(h('g', { key: 'pin', className: 'dm-pin dm-pin-' + p.pin.verdict },
          h('path', { d: 'M' + q[0] + ' ' + q[1] + 'c-7-11-15-18-15-28a15 15 0 1 1 30 0c0 10-8 17-15 28z' }),
          h('circle', { cx: q[0], cy: q[1] - 29, r: 5.5, className: 'dm-pin-dot' }),
          pinNamed ? null : h('text', { x: q[0], y: q[1] - 52, textAnchor: 'middle' }, p.pin.name)));
      }
    }
    var onClick = p.onMapClick ? function (e) {
      var svg = e.currentTarget, m = svg.getScreenCTM && svg.getScreenCTM();
      if (!m) return;
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var s = pt.matrixTransform(m.inverse()), ll = unproject(s.x, s.y);
      p.onMapClick(+ll[0].toFixed(4), +ll[1].toFixed(4));
    } : undefined;
    return h('svg', {
      className: 'dm-svg' + (p.onMapClick ? ' dm-edit' : ''), viewBox: fr.join(' '), role: 'img', onClick: onClick,
      'aria-label': 'Mapa obszaru dowozu z ' + area.center.name + ': ' + area.towns.map(function (t) { return t.name; }).join(', '),
    }, kids);
  }

  // Mała Polska z zaznaczonym obszarem — „gdzie to jest"
  function Inset(p) {
    var c = projectInset(p.area.center.lat, p.area.center.lon);
    return h('svg', { className: 'dm-inset', viewBox: '-6 -6 ' + (INSET.w + 12) + ' ' + (INSET.h + 12), 'aria-hidden': 'true' },
      h('path', { className: 'dm-pl', d: POLAND }),
      h('path', { className: 'dm-inset-area', d: p.area.insetPath }),
      h('circle', { className: 'dm-c', cx: c[0], cy: c[1], r: 3.5, strokeWidth: 1.5 }));
  }

  /* Geokoder: miejscowość / kod pocztowy -> lista miejsc. Wyniki trzymamy
     w pamięci na czas wizyty, a /api/geocode ma cache CDN. */
  var memo = {};
  function geocode(q) {
    var key = String(q || '').trim().replace(/\s+/g, ' ').toLowerCase();
    if (key.length < 2) return Promise.resolve([]);
    if (memo[key]) return memo[key];
    memo[key] = fetch('/api/geocode?q=' + encodeURIComponent(key))
      .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || 'Błąd ' + r.status); return d.results || []; }); })
      .catch(function (e) { delete memo[key]; throw e; });
    return memo[key];
  }
  function reverse(lat, lon) {
    return fetch('/api/geocode?lat=' + lat + '&lon=' + lon)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { return d && d.result ? d.result : null; })
      .catch(function () { return null; });
  }
  function fmtKm(v) { return v < 10 ? v.toFixed(1).replace('.', ',') : String(Math.round(v)); }
  function placeLabel(r) { return [r.postcode, r.name].filter(Boolean).join(' ') + (r.area ? ' — ' + r.area : ''); }

  /* Wyszukiwarka „czy dowozimy". props: area, onPin(pin|null), ctaHref, phone */
  function Checker(p) {
    var R = window.React, st = R.useState({ q: '', busy: false, choices: null, res: null, err: '' });
    var s = st[0], set = function (patch) { st[1](function (o) { return Object.assign({}, o, patch); }); };
    function judge(place) {
      var c = check(p.area, place.lat, place.lon);
      var pin = { name: place.name, lat: place.lat, lon: place.lon, verdict: c.verdict };
      set({ res: { place: place, c: c }, choices: null, busy: false, err: '' });
      if (p.onPin) p.onPin(pin);
    }
    function submit(e) {
      e.preventDefault();
      var q = s.q.trim();
      if (q.length < 2) return;
      set({ busy: true, err: '', res: null, choices: null });
      if (p.onPin) p.onPin(null);
      geocode(q).then(function (list) {
        if (!list.length) { set({ busy: false, err: 'none' }); if (p.onPin) p.onPin(null); return; }
        var a = list[0], b = list[1];
        // Kilka miejsc o tej samej nazwie (np. „Nowa Wieś") — pytamy, które
        if (b && a.name.toLowerCase() === b.name.toLowerCase() && !/^\d{2}-?\d{3}$/.test(q)) set({ busy: false, choices: list.slice(0, 6) });
        else judge(a);
      }).catch(function () { set({ busy: false, err: 'fail' }); });
    }
    var out = null;
    if (s.err === 'none') out = h('p', { className: 'dm-ans dm-ans-none' }, 'Nie znaleźliśmy „' + s.q.trim() + '”. Sprawdź pisownię albo wpisz kod pocztowy (np. 09-100).');
    else if (s.err === 'fail') out = h('p', { className: 'dm-ans dm-ans-none' }, 'Nie udało się teraz sprawdzić. ', p.phone ? h('span', null, 'Zadzwoń: ', h('a', { href: 'tel:' + String(p.phone).replace(/[^+\d]/g, '') }, p.phone), ' — odpowiemy od ręki.') : 'Napisz do nas — odpowiemy od ręki.');
    else if (s.choices) out = h('div', { className: 'dm-choices' },
      h('span', { className: 'dm-k' }, 'Którą miejscowość masz na myśli?'),
      s.choices.map(function (c, i) { return h('button', { key: i, type: 'button', className: 'dm-choice', onClick: function () { judge(c); } }, placeLabel(c)); }));
    else if (s.res) {
      var c = s.res.c, nm = h('b', null, s.res.place.name), d = fmtKm(c.distKm) + ' km od naszej bazy w linii prostej';
      var txt = c.verdict === 'in' ? [nm, ' jest w naszym obszarze dowozu — ok. ' + d + '. Dowieziemy własnym transportem.']
        : c.verdict === 'edge' ? [nm, ' leży na skraju obszaru (ok. ' + d + '). Napisz albo zadzwoń — potwierdzimy dowóz.']
        : [nm, ' jest poza obszarem naszego transportu (ok. ' + d + '). Wyślemy spedycją w całej Polsce.'];
      out = h('div', { className: 'dm-ans dm-ans-' + c.verdict, role: 'status' },
        h('span', { className: 'dm-ans-ic', 'aria-hidden': 'true' }, c.verdict === 'in' ? '✓' : c.verdict === 'edge' ? '?' : '→'),
        h('span', null, txt, s.res.place.area ? h('small', null, s.res.place.area) : null,
          p.ctaHref ? h('a', { className: 'dm-ans-a', href: p.ctaHref }, c.verdict === 'out' ? 'Zapytaj o wysyłkę →' : 'Zapytaj o dostawę →') : null));
    }
    return h('form', { className: 'dm-check', onSubmit: submit },
      h('label', { className: 'dm-k', htmlFor: p.id || 'dm-q' }, 'Sprawdź swoją miejscowość'),
      h('div', { className: 'dm-check-row' },
        h('input', { id: p.id || 'dm-q', value: s.q, placeholder: 'Miejscowość albo kod pocztowy', autoComplete: 'address-level2',
          onChange: function (e) { set({ q: e.target.value }); } }),
        h('button', { type: 'submit', className: 'btn btn-flame dm-check-btn', disabled: s.busy || s.q.trim().length < 2 }, s.busy ? 'Sprawdzam…' : 'Sprawdź')),
      out,
      // Wyszukiwanie korzysta z danych OpenStreetMap — licencja ODbL wymaga podpisu
      h('small', { className: 'dm-attr' }, 'Wyszukiwanie miejscowości: © ',
        h('a', { href: 'https://www.openstreetmap.org/copyright', target: '_blank', rel: 'noopener' }, 'współtwórcy OpenStreetMap')));
  }

  /* Cała sekcja „Gdzie dowozimy". props: value (ustawienie delivery_area),
     cta (przycisk pod spodem), ctaHref, phone, embedded — wersja do
     wstawienia w inną kartę (strona główna: pod ofertą dla sklepów). */
  function Section(p) {
    var R = window.React;
    var area = R.useMemo(function () { return resolve(p.value); }, [p.value]);
    var hv = R.useState(null), sl = R.useState(null), pn = R.useState(null);
    var hl = hv[0] || sl[0];
    var base = [area.center.postal, area.center.name].filter(Boolean).join(' ');
    var head = h('div', { className: 'dm-head' },
          h('span', { className: 'eyebrow' }, 'Gdzie dowozimy'),
          h(p.embedded ? 'h3' : 'h2', { className: 'dm-h' }, p.embedded ? 'Sprawdź, czy do Ciebie dojedziemy.' : 'Sprawdź, czy dowozimy do\u00a0Ciebie.'),
          h('p', { className: 'dm-lead' }, 'Baza: ' + [area.center.postal, area.center.name].filter(Boolean).join(' ') +
            '. Własnym transportem dojeżdżamy do sklepów i hurtowni w całym zaznaczonym obszarze — od paczki po paletę, pod sam sklep. Dalej wysyłamy spedycją w całej Polsce.'));
    var body = h('div', { className: 'dm-grid' },
          h('div', { className: 'dm-card' }, h(MapView, { area: area, hl: hl, onHover: hv[1], pin: pn[0] })),
          h('div', { className: 'dm-side' },
            h(Checker, { area: area, onPin: pn[1], ctaHref: p.ctaHref || '#kontakt', phone: p.phone }),
            h('div', { className: 'dm-legend-row' },
              h(Inset, { area: area }),
              h('div', { className: 'dm-legend', 'aria-hidden': 'true' },
                h('span', null, h('i', { className: 'dm-li-base' }), ' Baza: ' + [area.center.postal, area.center.name].filter(Boolean).join(' ')),
                h('span', null, h('i', { className: 'dm-li-area' }), ' obszar dowozu'),
                h('span', null, h('i', { className: 'dm-li-ring' }), ' 100 km od bazy'),
                h('span', null, h('i', { className: 'dm-li-road' }), ' główne drogi (schemat)'))),
            h('div', null,
              h('div', { className: 'dm-k', style: { marginBottom: 10 } }, 'Dojeżdżamy m.in. do'),
              h('div', { className: 'dm-towns' }, area.towns.map(function (t) {
                return h('button', { key: t.name + t.lat, type: 'button', className: 'dm-chip' + (hl === t.name ? ' on' : ''), 'aria-pressed': sl[0] === t.name,
                  onMouseEnter: function () { hv[1](t.name); }, onMouseLeave: function () { hv[1](null); },
                  onClick: function () { sl[1](function (v) { return v === t.name ? null : t.name; }); } }, t.name);
              }))),
            p.cta || null));
    if (p.embedded) return h('div', { id: 'dowoz', className: 'dm-embed' }, head, body);
    return h('section', { id: 'dowoz', className: 'sec dm-sec' }, h('div', { className: 'wrap' }, head, body));
  }

  window.LangerDelivery = {
    DEFAULT: DEFAULT, REF: REF, ROADS: ROADS, VIEW: VIEW, INSET: INSET, RIVERS: RIVERS, POLAND: POLAND, EDGE_KM: EDGE_KM,
    project: project, unproject: unproject, km: km, resolve: resolve, check: check, frame: frame, autoLabel: autoLabel,
    geocode: geocode, reverse: reverse, placeLabel: placeLabel, fmtKm: fmtKm,
    MapView: MapView, Inset: Inset, Checker: Checker, Section: Section,
  };
})();
