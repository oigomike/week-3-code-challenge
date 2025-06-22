var postList = document.getElementById("post-list");
var detailTitle = document.getElementById("detail-title");
var detailContent = document.getElementById("detail-content");
var detailAuthor = document.getElementById("detail-author");

var editBtn = document.getElementById("edit-btn");
var deleteBtn = document.getElementById("delete-btn");

var newForm = document.getElementById("new-post-form");
var editForm = document.getElementById("edit-post-form");

var currentId = null;
var apiUrl = "http://localhost:3000/posts";

document.addEventListener("DOMContentLoaded", function () {
  loadPosts();

  newForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var title = document.getElementById("new-title").value;
    var content = document.getElementById("new-content").value;
    var author = document.getElementById("new-author").value;

    var postData = {
      title: title,
      content: content,
      author: author
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    })
      .then(function (res) {
        return res.json();
      })
      .then(function () {
        newForm.reset();
        loadPosts();
      });
  });

  editBtn.addEventListener("click", function () {
    editForm.classList.remove("hidden");
    document.getElementById("edit-title").value = detailTitle.textContent;
    document.getElementById("edit-content").value = detailContent.textContent;
  });

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var newTitle = document.getElementById("edit-title").value;
    var newContent = document.getElementById("edit-content").value;

    fetch(apiUrl + "/" + currentId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newTitle,
        content: newContent
      })
    })
      .then(function () {
        editForm.classList.add("hidden");
        loadPosts();
      });
  });

  deleteBtn.addEventListener("click", function () {
    fetch(apiUrl + "/" + currentId, {
      method: "DELETE"
    }).then(function () {
      detailTitle.textContent = "";
      detailContent.textContent = "";
      detailAuthor.textContent = "";
      editBtn.classList.add("hidden");
      deleteBtn.classList.add("hidden");
      loadPosts();
    });
  });

  document.getElementById("cancel-edit").addEventListener("click", function () {
    editForm.classList.add("hidden");
  });
});

function loadPosts() {
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (posts) {
      postList.innerHTML = "";
      for (var i = 0; i < posts.length; i++) {
        showPost(posts[i]);
      }

      if (posts.length > 0) {
        loadDetails(posts[0].id);
      }
    });
}

function showPost(post) {
  var li = document.createElement("li");
  li.textContent = post.title;

  li.addEventListener("click", function () {
    loadDetails(post.id);
  });

  postList.appendChild(li);
}

function loadDetails(id) {
  fetch(apiUrl + "/" + id)
    .then(function (res) {
      return res.json();
    })
    .then(function (post) {
      detailTitle.textContent = post.title;
      detailContent.textContent = post.content;
      detailAuthor.textContent = "By: " + post.author;

      editBtn.classList.remove("hidden");
      deleteBtn.classList.remove("hidden");

      currentId = post.id;
    });
}


