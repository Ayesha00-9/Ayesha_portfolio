
// // document.getElementById('contact-form').addEventListener('submit', async function (event) {
// //     event.preventDefault(); // Prevent the default form submission

// //     const formData = new FormData(this); // Collect form data
// //     const formObject = Object.fromEntries(formData.entries()); // Convert form data to an object

// //     try {
// //         const response = await fetch('/api/contact', {
// //             method: 'POST',
// //             headers: {
// //                 'Content-Type': 'application/x-www-form-urlencoded', // Sending form data in URL encoded format
// //             },
// //             body: new URLSearchParams(formObject), // Send form data in URLSearchParams format
// //         });

// //         const result = await response.json(); // Parse JSON response
        
// //         if (response.ok) {
// //             // Success: Display success message on the page and reset form
// //             document.getElementById('form-feedback').innerHTML = `<p>Message sent successfully!</p>`;
// //             document.getElementById('contact-form').reset(); // Reset the form fields
// //         } else {
// //             // Failure: Display error message on the page
// //             document.getElementById('form-feedback').innerHTML = `<p>Error: ${result.message || 'Failed to send message'}</p>`;
// //         }
// //     } catch (error) {
// //         console.error('Error:', error); // Log errors
// //         // Display generic error message on the page
// //         document.getElementById('form-feedback').innerHTML = `<p>There was an issue sending your message. Please try again later.</p>`;
// //     }
// // });



// // document.getElementById('contact-form').addEventListener('submit', async function (event) {
// //     event.preventDefault(); // Prevent the default form submission

// //     const form = this;
// //     const feedback = document.getElementById('form-feedback');
// //     const submitButton = form.querySelector('button[type="submit"]');

// //     // Show loading state
// //     feedback.innerHTML = '<p>Sending message...</p>';
// //     submitButton.disabled = true;

// //     const formData = new FormData(form);
// //     const formObject = Object.fromEntries(formData.entries());

// //     try {
// //         const response = await fetch('http://localhost:3000/api/contact', { // Use full URL for testing
// //             method: 'POST',
// //             headers: {
// //                 'Content-Type': 'application/x-www-form-urlencoded',
// //             },
// //             body: new URLSearchParams(formObject),
// //         });

// //         const result = await response.json();

// //         if (response.ok) {
// //             feedback.innerHTML = '<p>Message sent successfully! I\'ll get back to you soon.</p>';
// //             form.reset();
// //         } else {
// //             feedback.innerHTML = `<p>Error: ${result.message || 'Failed to send message'}</p>`;
// //         }
// //     } catch (error) {
// //         console.error('Error:', error);
// //         feedback.innerHTML = '<p>There was an issue sending your message. Please try again later.</p>';
// //     } finally {
// //         submitButton.disabled = false;
// //     }
// // });

// document.getElementById('contact-form').addEventListener('submit', async function (event) {
//     event.preventDefault(); // Prevent default form submission

//     const form = this;
//     const feedback = document.getElementById('form-feedback');
//     const submitButton = form.querySelector('button[type="submit"]');

//     // Show loading state
//     feedback.innerHTML = '<p>Sending message...</p>';
//     submitButton.disabled = true;

//     const formData = new FormData(form);
//     const formObject = Object.fromEntries(formData.entries());
//     console.log('Form data sent:', formObject); // Debug log

//     try {
//         const response = await fetch('http://localhost:3000/api/contact', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: new URLSearchParams(formObject),
//         });

//         const result = await response.json();
//         console.log('Server response:', result); // Debug log

//         if (response.ok) {
//             feedback.innerHTML = '<p>Message sent successfully! I\'ll get back to you soon.</p>';
//             form.reset();
//         } else {
//             feedback.innerHTML = `<p>Error: ${result.error || 'Failed to send message'}</p>`;
//         }
//     } catch (error) {
//         console.error('Fetch error:', error);
//         feedback.innerHTML = '<p>There was an issue sending your message. Please try again later or check the console.</p>';
//     } finally {
//         submitButton.disabled = false;
//     }
// });


const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields (name, email, message) are required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.GMAIL_USER,
    subject: subject || 'New Contact Form Submission',
    text: `You have a new message from ${name} (${email})\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};