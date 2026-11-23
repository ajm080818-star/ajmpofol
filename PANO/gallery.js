
document.addEventListener("DOMContentLoaded", function () {

    // =================================
    // ELEMENT
    // =================================

    const animationItems = document.querySelectorAll(".animation-item");
    const illustrationItems = document.querySelectorAll(".illustration-item");

    const galleryItems = document.querySelectorAll(
        ".animation-item, .illustration-item"
    );

    const modal = document.querySelector(".gallery-modal");
    const modalContent = document.querySelector(".gallery-modal-content");

    const closeButton = document.querySelector(".modal-close");
    const prevButton = document.querySelector(".modal-prev");
    const nextButton = document.querySelector(".modal-next");
    const modalBackground = document.querySelector(".modal-background");


    // =================================
    // STATE
    // =================================

    let currentIndex = 0;
    let isModalOpen = false;

    // 현재 페이지 구분
    const isAnimationPage = animationItems.length > 0;
    const isIllustrationPage = illustrationItems.length > 0;

    // 현재 페이지 작업물 (최신순 정렬)
    const items = Array.from(
        isAnimationPage ? animationItems : illustrationItems
    ).reverse();

    // HTML 화면에도 역순으로 배치
    items.forEach(item => {
        item.parentElement.appendChild(item);
    });


    // =================================
    // ELEMENT CHECK
    // =================================

    if (!modal || !modalContent || items.length === 0) {
        console.log("PANO Gallery: 작업물이 없습니다.");
        return;
    }


    // =================================
    // OPEN MODAL
    // =================================

    function openModal(index) {

        currentIndex = index;
        isModalOpen = true;

        // 배경 미리보기 영상 정지
        animationItems.forEach(item => {
            const video = item.querySelector("video");

            if (video) {
                video.pause();
            }
        });

        modal.style.display = "block";

        showWork(currentIndex);

        // 스크롤 방지
        document.body.style.overflow = "hidden";
    }


    // =================================
    // SHOW WORK
    // =================================

    function showWork(index) {

        modalContent.innerHTML = "";

        const item = items[index];

        if (!item) return;


        // ANIMATION VIDEO
        if (isAnimationPage) {

            const originalVideo = item.querySelector("video");

            const video = document.createElement("video");

            video.src =
                originalVideo.currentSrc ||
                originalVideo.getAttribute("src");

            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            video.preload = "auto";
            video.muted = false;
            video.loop = false;

            modalContent.appendChild(video);

            // 영상 재생
            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("영상 자동 재생이 제한되었습니다.", error);
                });
            }

        }


        // ILLUSTRATION IMAGE
        else if (isIllustrationPage) {

            const originalImage = item.querySelector("img");

            const image = document.createElement("img");

            image.src =
                originalImage.currentSrc ||
                originalImage.src;

            image.alt = originalImage.alt;

            modalContent.appendChild(image);

        }

    }


    // =================================
    // CLOSE MODAL
    // =================================

    function closeModal() {

        if (!isModalOpen) return;

        isModalOpen = false;

        // 모달 영상 정지 및 제거
        modalContent.innerHTML = "";

        modal.style.display = "none";

        // 스크롤 복구
        document.body.style.overflow = "";

        // 작화 미리보기 재생 재개
        animationItems.forEach(item => {

            const video = item.querySelector("video");

            if (video) {

                video.muted = true;

                const playPromise = video.play();

                if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                }

            }

        });

    }


    // =================================
    // NEXT WORK
    // =================================

    function nextWork() {

        if (items.length <= 1) return;

        currentIndex++;

        if (currentIndex >= items.length) {
            currentIndex = 0;
        }

        showWork(currentIndex);

    }


    // =================================
    // PREVIOUS WORK
    // =================================

    function prevWork() {

        if (items.length <= 1) return;

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = items.length - 1;
        }

        showWork(currentIndex);

    }


    // =================================
    // ITEM CLICK
    // =================================

    items.forEach((item, index) => {

        item.addEventListener("click", function () {

            openModal(index);

        });

    });


    // =================================
    // BUTTON EVENTS
    // =================================

    closeButton.addEventListener("click", closeModal);

    nextButton.addEventListener("click", nextWork);

    prevButton.addEventListener("click", prevWork);

    modalBackground.addEventListener("click", closeModal);


    // =================================
    // KEYBOARD EVENTS
    // =================================

    document.addEventListener("keydown", function (event) {

        if (!isModalOpen) return;

        if (event.key === "Escape") {
            closeModal();
        }

        if (event.key === "ArrowRight") {
            nextWork();
        }

        if (event.key === "ArrowLeft") {
            prevWork();
        }

    });


    // =================================
    // INITIALIZE
    // =================================

    console.log("PANO Gallery 정상 실행");

    console.log(
        "현재 페이지:",
        isAnimationPage ? "Animation" : "Illustration"
    );

    console.log(
        "등록된 작업물:",
        items.length
    );

});
