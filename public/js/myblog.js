const submitUpdateHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#title").value.trim();
  const description = document.querySelector("#description").value.trim();
  const id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];

  if (title && description) {
    const response = await fetch(`/myblog/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: title,
        description: description,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace(`/dashboard`);
    } else {
      alert("Failed to update blog.");
    }
  }
};
