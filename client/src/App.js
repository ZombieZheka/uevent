import React from "react";
import { Route, Routes } from "react-router-dom";
import { PaymentContainer } from "./payment/features/payment/Payment";
import { RedirectContainer } from "./payment/features/redirect/Redirect";
import { PreviewContainer } from "./payment/features/preview/Preview";
import { StatusContainer } from "./payment/features/status/Status";
import { CancelContainer } from "./payment/features/cancel/Cancel";
import { Home1 } from "./payment/features/home/Home";

import Explore from "./explore";
import Home from './home';
import SignUp from "./signup";
import Login from "./login";
import CreateEvent from "./create_event";
import ProfilePage from "./profile";

function App() {
    return(
        <div className='app'>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/signup" element={<SignUp />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/explore" element={<Explore />}/>
                <Route path="/create" element={<CreateEvent />}/>
                <Route path="/profile/:handle" element={<ProfilePage />}/>
                <Route path="/api/confirm-email/:id" element={<ConfirmationPage />} />

                <Route path="/preview/:type" element={<PreviewContainer />} />
                <Route path="/checkout/:type" element={<PaymentContainer />} />
                <Route path="/status/:type" element={<StatusContainer />} />
                <Route path="/cancel" element={<CancelContainer />} />
                <Route path="/redirect" element={<RedirectContainer />} />
                <Route path="/home" element={<Home1 />} />
            </Routes>
        </div>
    );
}

export default App;
