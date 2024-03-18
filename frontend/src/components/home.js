import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";

const Home = () => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        async function fetchEntries() {
            try {
                const apiKey = 'aniruddhaqwerty1234'; // Replace with your actual API key

                // Fetch data for Offers
                const offersResponse = await fetch('http://localhost:3000/offer_db/offers/read', {
                    headers: {
                        'x-api-key': apiKey
                    }
                });

                if (!offersResponse.ok) {
                    throw new Error(`An error occurred while fetching offers: ${offersResponse.statusText}`);
                }

                const offersData = await offersResponse.json();

                // Fetch data for Users
                const usersResponse = await fetch('http://localhost:3000/user_data/users/read', {
                    headers: {
                        'x-api-key': apiKey
                    }
                });

                if (!usersResponse.ok) {
                    throw new Error(`An error occurred while fetching users: ${usersResponse.statusText}`);
                }

                const usersData = await usersResponse.json();

                // // Fetch data for Inquire (Assuming endpoint URL is available)
                // const inquireResponse = await fetch('http://localhost:3000/offer_db/inquire/read', {
                //     headers: {
                //         'x-api-key': apiKey
                //     }
                // });

                // if (!inquireResponse.ok) {
                //     throw new Error(`An error occurred while fetching inquire: ${inquireResponse.statusText}`);
                // }

                // const inquireData = await inquireResponse.json();

                setEntries([
                    { category: 'Offers', count: offersData.length },
                    { category: 'Users', count: usersData.length },
                    // { category: 'Inquire', count: inquireData.length }
                ]);
            } catch (error) {
                console.error('Error fetching entries:', error);
            }
        }

        fetchEntries();
    }, []);

    return (
        <div>
            <div className="row justify-center">
                {entries.map((entry, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{entry.category}</h5>
                                <p className="card-text">Total Entries: {entry.count}</p>
                                <Link to={`/${entry.category.toLowerCase()}`} className="btn btn-primary">
                                    View {entry.category}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
